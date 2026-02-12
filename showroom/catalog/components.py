import json
from functools import lru_cache
from pathlib import Path

from django.conf import settings

COMPONENTS_ROOT = Path(settings.BASE_DIR) / "components" / "cotton" / "ds"
FOUNDATIONS_ROOT = Path(settings.BASE_DIR) / "showroom" / "foundations"


def _read_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def _normalize_order(raw_order):
    try:
        return int(raw_order)
    except (TypeError, ValueError):
        return 10_000


def _load_component_stories(component_dir: Path, metadata: dict):
    stories_value = metadata.get("stories")

    if isinstance(stories_value, list):
        return stories_value

    if isinstance(stories_value, str):
        stories_path = component_dir / stories_value
        stories = _read_json(stories_path)
        return stories if isinstance(stories, list) else []

    return []


def _load_component_controls(component_dir: Path, metadata: dict):
    cotton_meta = _normalize_cotton_metadata(metadata)
    controls_value = cotton_meta.get("controls")

    if isinstance(controls_value, dict):
        return controls_value

    if isinstance(controls_value, str):
        controls_path = component_dir / controls_value
        controls = _read_json(controls_path)
        return controls if isinstance(controls, dict) else {}

    return {}


def _normalize_react_metadata(metadata: dict):
    react_value = metadata.get("react")

    if not isinstance(react_value, dict):
        return {}

    preview_value = react_value.get("preview")
    if isinstance(preview_value, str) and preview_value.strip():
        return {"preview": preview_value}
    return {}


def _normalize_cotton_metadata(metadata: dict):
    cotton_value = metadata.get("cotton")

    if not isinstance(cotton_value, dict):
        return {}

    cotton_meta = {}
    template_value = cotton_value.get("template")
    if isinstance(template_value, str) and template_value.strip():
        cotton_meta["template"] = template_value

    controls_value = cotton_value.get("controls")
    if isinstance(controls_value, dict):
        cotton_meta["controls"] = controls_value
    elif isinstance(controls_value, str) and controls_value.strip():
        cotton_meta["controls"] = controls_value

    return cotton_meta


def _foundation_from_metadata(metadata: dict):
    slug = metadata.get("slug")
    label = metadata.get("label")
    template = metadata.get("template")

    if not slug or not label or not template:
        return None

    return {
        "slug": slug,
        "label": label,
        "type": metadata.get("type", "page"),
        "template": template,
        "stories": [],
        "_order": _normalize_order(metadata.get("order")),
    }


def _component_from_metadata(path: Path, metadata: dict):
    slug = metadata.get("slug")
    label = metadata.get("label")

    if not slug or not label:
        return None

    component_dir = path.parent
    stories = _load_component_stories(component_dir, metadata)
    controls = _load_component_controls(component_dir, metadata)
    react_meta = _normalize_react_metadata(metadata)
    cotton_meta = _normalize_cotton_metadata(metadata)
    has_react = bool(react_meta.get("preview"))

    return {
        "slug": slug,
        "label": label,
        "type": metadata.get("type", "component"),
        "template": cotton_meta.get("template"),
        "stories": stories,
        "controls": controls,
        "react": react_meta,
        "cotton": cotton_meta,
        "has_react": has_react,
        "_order": _normalize_order(metadata.get("order")),
    }


def _is_allowed_component(entry: dict):
    allowlist = getattr(settings, "SHOWROOM_COMPONENT_ALLOWLIST", None)
    if not allowlist:
        return True
    if entry.get("type") != "component":
        return True
    return entry.get("slug") in set(allowlist)


@lru_cache(maxsize=1)
def load_components():
    entries = []

    for metadata_path in sorted(FOUNDATIONS_ROOT.glob("*/foundation.json")):
        metadata = _read_json(metadata_path)
        if not isinstance(metadata, dict):
            continue
        entry = _foundation_from_metadata(metadata)
        if entry:
            entries.append(entry)

    for metadata_path in sorted(COMPONENTS_ROOT.glob("**/component.json")):
        metadata = _read_json(metadata_path)
        if not isinstance(metadata, dict):
            continue
        entry = _component_from_metadata(metadata_path, metadata)
        if entry:
            entries.append(entry)

    entries.sort(key=lambda item: (item["_order"], item["label"].lower(), item["slug"]))

    filtered_entries = [entry for entry in entries if _is_allowed_component(entry)]

    for entry in filtered_entries:
        entry.pop("_order", None)

    return filtered_entries


COMPONENTS = load_components()
