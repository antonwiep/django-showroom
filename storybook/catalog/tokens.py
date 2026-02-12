import re
from functools import lru_cache
from pathlib import Path

from django.conf import settings

TOKEN_PATTERN = re.compile(r"^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);", re.MULTILINE)

COLOR_GROUP_LABELS = {
    "slate": "Slate",
    "blue": "Blue",
    "amber": "Amber",
    "red": "Red",
    "green": "Green",
    "alpha": "Alpha",
    "other": "Other",
}

COLOR_GROUP_DESCRIPTIONS = {
    "slate": "Neutral greys",
    "blue": "Primary / accent",
    "amber": "Warning / yellow",
    "red": "Danger",
    "green": "Success",
    "alpha": "Black transparency",
    "other": "",
}

COLOR_GROUP_ORDER = [
    "slate",
    "blue",
    "amber",
    "red",
    "green",
    "alpha",
    "other",
]


def _tokens_css_path() -> Path:
    return Path(settings.BASE_DIR) / "components" / "tokens.css"


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
    palette = short_name.split("-", 1)[0]
    if palette in {"slate", "blue", "amber", "red", "green", "alpha"}:
        return palette
    return "other"


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
        tokens.sort(key=lambda token: _sort_token_name(token["short_name"]))
        ordered_groups.append(
            {
                "key": group_key,
                "label": COLOR_GROUP_LABELS[group_key],
                "description": COLOR_GROUP_DESCRIPTIONS.get(group_key, ""),
                "tokens": tokens,
            }
        )
    return ordered_groups


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
