import json
import re
from functools import lru_cache
from pathlib import Path

from django.conf import settings
from django.utils.html import escape


def _icons_dir() -> Path:
    return Path(settings.BASE_DIR) / "static" / "icons" / "design-system"


def _manifest_path() -> Path:
    return _icons_dir() / "manifest.json"


@lru_cache(maxsize=1)
def get_design_icons():
    manifest_path = _manifest_path()
    if not manifest_path.exists():
        return []

    manifest_data = json.loads(manifest_path.read_text(encoding="utf-8"))
    icons = []

    for entry in manifest_data:
        file_name = entry.get("file")
        icon_name = entry.get("name")
        if not file_name or not icon_name:
            continue

        svg_path = _icons_dir() / file_name
        if not svg_path.exists():
            continue

        icons.append(
            {
                "name": icon_name,
                "label": entry.get("label", icon_name),
                "svg": svg_path.read_text(encoding="utf-8").strip(),
            }
        )

    return icons


@lru_cache(maxsize=1)
def get_design_icon_map():
    return {icon["name"]: icon for icon in get_design_icons()}


def render_design_icon(icon_name: str, css_class: str = ""):
    icon = get_design_icon_map().get(icon_name)
    if not icon:
        return ""

    svg_markup = icon["svg"]
    if not css_class:
        return svg_markup

    escaped_class = escape(css_class)

    def add_svg_class(match):
        open_tag = match.group(0)
        class_match = re.search(r'class="([^"]*)"', open_tag)
        if class_match:
            merged = f'{class_match.group(1)} {escaped_class}'.strip()
            return re.sub(r'class="[^"]*"', f'class="{merged}"', open_tag, count=1)
        return open_tag[:-1] + f' class="{escaped_class}">'

    return re.sub(r"<svg\b[^>]*>", add_svg_class, svg_markup, count=1)
