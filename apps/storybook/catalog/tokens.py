import re
from functools import lru_cache
from pathlib import Path

from django.conf import settings

TOKEN_PATTERN = re.compile(r"^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);", re.MULTILINE)

COLOR_GROUP_LABELS = {
    "g": "Greyscale",
    "a": "Accent",
    "y": "Yellow",
    "d": "Red / Danger",
    "s": "Green / Success",
    "alpha": "Alpha",
    "status": "Statuses",
    "other": "Other",
}

COLOR_GROUP_DESCRIPTIONS = {
    "g": "Grey tones",
    "a": "Primary accent colors",
    "y": "Warning/yellow tones",
    "d": "Danger and error states",
    "s": "Positive and success states",
    "status": "Contextual status colors",
    "alpha": "Transparent colors",
    "other": "",
}

COLOR_GROUP_ORDER = [
    "a",
    "y",
    "d",
    "s",
    "g",
    "alpha",
    "status",
    "other",
]

STATUS_TOKEN_ORDER = {
    "neutral": 0,
    "pending": 1,
    "info": 2,
    "danger": 3,
    "warning": 4,
    "success": 5,
    "muted": 6,
}


def _tokens_css_path() -> Path:
    return Path(settings.BASE_DIR) / "design-system" / "src" / "tokens.css"


@lru_cache(maxsize=1)
def get_token_map():
    content = _tokens_css_path().read_text(encoding="utf-8")
    token_map = {}
    for match in TOKEN_PATTERN.finditer(content):
        token_map[match.group(1)] = match.group(2).strip()
    return token_map


def _sort_token_name(name: str):
    numeric_suffix = re.search(r"(\d+)$", name)
    if numeric_suffix:
        prefix = name[: numeric_suffix.start()]
        return (prefix, int(numeric_suffix.group(1)), name)
    return (name, -1, name)


def _color_group(token_name: str):
    short_name = token_name.removeprefix("--color-")
    if short_name.startswith("status-"):
        return "status"
    if short_name.startswith("alpha-"):
        return "alpha"

    match = re.match(r"([a-z]+)", short_name)
    if not match:
        return "other"
    prefix = match.group(1)
    if prefix in {"g", "a", "y", "d", "s"}:
        return prefix
    return "other"


def _status_base_and_suffix(name: str):
    status_name = name.removeprefix("status-")
    status_base, _, suffix = status_name.partition("-")
    suffix_order = int(suffix) if suffix.isdigit() else -1
    return status_base, suffix_order


def _build_status_stacks(tokens):
    stacks = {}
    for token in tokens:
        status_base, suffix_order = _status_base_and_suffix(token["short_name"])
        stacks.setdefault(status_base, []).append((suffix_order, token))

    ordered_stacks = []
    for status_base, stack_tokens in sorted(
        stacks.items(), key=lambda item: STATUS_TOKEN_ORDER.get(item[0], len(STATUS_TOKEN_ORDER))
    ):
        ordered_stacks.append(
            {
                "name": status_base,
                "tokens": [token for _, token in sorted(stack_tokens, key=lambda item: item[0])],
            }
        )
    return ordered_stacks


def get_color_token_groups():
    groups = {}
    for token_name, token_value in get_token_map().items():
        if not token_name.startswith("--color-"):
            continue

        group_key = _color_group(token_name)
        groups.setdefault(group_key, []).append(
            {
                "css_var": token_name,
                "name": token_name.removeprefix("--"),
                "short_name": token_name.removeprefix("--color-"),
                "value": token_value,
            }
        )

    ordered_groups = []
    for group_key in COLOR_GROUP_ORDER:
        tokens = groups.get(group_key, [])
        if not tokens:
            continue
        if group_key == "status":
            tokens.sort(key=lambda token: _sort_status_token(token["short_name"]))
        else:
            tokens.sort(key=lambda token: _sort_token_name(token["short_name"]))
        ordered_groups.append(
            {
                "key": group_key,
                "label": COLOR_GROUP_LABELS[group_key],
                "description": COLOR_GROUP_DESCRIPTIONS.get(group_key, ""),
                "tokens": tokens,
                "status_stacks": _build_status_stacks(tokens) if group_key == "status" else [],
            }
        )
    return ordered_groups


def _sort_status_token(name: str):
    status_base, suffix_order = _status_base_and_suffix(name)
    base_order = STATUS_TOKEN_ORDER.get(status_base, len(STATUS_TOKEN_ORDER))
    return (base_order, suffix_order, status_base, name)


def _token_px_value(value: str):
    match = re.match(r"([0-9.]+)px$", value.strip())
    if not match:
        return float("inf")
    return float(match.group(1))


def get_text_tokens():
    token_map = get_token_map()
    base_names = []
    for token_name in token_map:
        if not token_name.startswith("--text-"):
            continue
        suffix = token_name.removeprefix("--text-")
        if "--" in suffix:
            continue
        base_names.append(suffix)

    base_names.sort(
        key=lambda base: (
            _token_px_value(token_map[f"--text-{base}"]),
            base,
        )
    )

    tokens = []
    for base in base_names:
        size_var = f"--text-{base}"
        line_height_var = f"--text-{base}--line-height"
        font_weight_var = f"--text-{base}--font-weight"
        letter_spacing_var = f"--text-{base}--letter-spacing"

        tokens.append(
            {
                "name": base,
                "size_var": size_var,
                "size_value": token_map.get(size_var),
                "line_height_var": line_height_var if line_height_var in token_map else "",
                "line_height_value": token_map.get(line_height_var, ""),
                "font_weight_var": font_weight_var if font_weight_var in token_map else "",
                "font_weight_value": token_map.get(font_weight_var, ""),
                "letter_spacing_var": letter_spacing_var
                if letter_spacing_var in token_map
                else "",
                "letter_spacing_value": token_map.get(letter_spacing_var, ""),
            }
        )
    return tokens
