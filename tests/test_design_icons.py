"""Tests for storybook.design_icons."""

from storybook.design_icons import (
    get_design_icon_map,
    get_design_icons,
    render_design_icon,
)


class TestGetDesignIcons:
    def test_returns_list(self):
        icons = get_design_icons()
        assert isinstance(icons, list)
        assert len(icons) > 0

    def test_icons_have_required_keys(self):
        icons = get_design_icons()
        for icon in icons:
            assert "name" in icon
            assert "label" in icon
            assert "svg" in icon

    def test_svg_is_valid_markup(self):
        icons = get_design_icons()
        for icon in icons:
            assert icon["svg"].startswith("<svg")


class TestGetDesignIconMap:
    def test_returns_dict_keyed_by_name(self):
        icon_map = get_design_icon_map()
        assert isinstance(icon_map, dict)
        assert "search" in icon_map
        assert icon_map["search"]["name"] == "search"


class TestRenderDesignIcon:
    def test_known_icon_returns_svg(self):
        result = render_design_icon("search")
        assert "<svg" in result

    def test_unknown_icon_returns_empty(self):
        result = render_design_icon("nonexistent-icon-xyz")
        assert result == ""

    def test_adds_css_class(self):
        result = render_design_icon("search", css_class="icon-lg")
        assert "icon-lg" in result

    def test_empty_css_class_returns_original_svg(self):
        original = render_design_icon("search")
        with_empty = render_design_icon("search", css_class="")
        assert original == with_empty
