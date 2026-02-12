"""Tests for storybook.catalog.components."""

import json

from storybook.catalog.components import (
    _component_from_metadata,
    _foundation_from_metadata,
    _load_component_controls,
    _load_component_stories,
    _normalize_cotton_metadata,
    _normalize_order,
    _normalize_react_metadata,
    _read_json,
)


class TestNormalizeOrder:
    def test_valid_integer(self):
        assert _normalize_order(10) == 10

    def test_valid_string_integer(self):
        assert _normalize_order("42") == 42

    def test_none_returns_fallback(self):
        assert _normalize_order(None) == 10_000

    def test_invalid_string_returns_fallback(self):
        assert _normalize_order("abc") == 10_000

    def test_empty_string_returns_fallback(self):
        assert _normalize_order("") == 10_000


class TestReadJson:
    def test_valid_json_file(self, tmp_path):
        f = tmp_path / "data.json"
        f.write_text('{"key": "value"}')
        assert _read_json(f) == {"key": "value"}

    def test_missing_file_returns_none(self, tmp_path):
        assert _read_json(tmp_path / "nonexistent.json") is None

    def test_invalid_json_returns_none(self, tmp_path):
        f = tmp_path / "bad.json"
        f.write_text("not json at all")
        assert _read_json(f) is None


class TestNormalizeReactMetadata:
    def test_with_preview(self):
        result = _normalize_react_metadata({"react": {"preview": "foo.ts"}})
        assert result == {"preview": "foo.ts"}

    def test_no_react_key(self):
        assert _normalize_react_metadata({}) == {}

    def test_react_not_dict(self):
        assert _normalize_react_metadata({"react": "invalid"}) == {}

    def test_empty_preview(self):
        assert _normalize_react_metadata({"react": {"preview": "  "}}) == {}


class TestNormalizeCottonMetadata:
    def test_with_template_and_controls_dict(self):
        result = _normalize_cotton_metadata(
            {
                "cotton": {
                    "template": "ds/button/index.html",
                    "controls": {"label": {"type": "text"}},
                }
            }
        )
        assert result["template"] == "ds/button/index.html"
        assert result["controls"] == {"label": {"type": "text"}}

    def test_with_controls_string_path(self):
        result = _normalize_cotton_metadata(
            {
                "cotton": {
                    "template": "ds/button/index.html",
                    "controls": "stories/controls.json",
                }
            }
        )
        assert result["controls"] == "stories/controls.json"

    def test_no_cotton_key(self):
        assert _normalize_cotton_metadata({}) == {}

    def test_cotton_not_dict(self):
        assert _normalize_cotton_metadata({"cotton": 42}) == {}


class TestLoadComponentStories:
    def test_inline_stories_list(self, tmp_path):
        stories = [{"slug": "default", "name": "Default"}]
        result = _load_component_stories(tmp_path, {"stories": stories})
        assert result == stories

    def test_stories_from_file(self, tmp_path):
        stories_data = [{"slug": "default", "name": "Default"}]
        (tmp_path / "stories.json").write_text(json.dumps(stories_data))
        result = _load_component_stories(tmp_path, {"stories": "stories.json"})
        assert result == stories_data

    def test_missing_stories_file_returns_empty(self, tmp_path):
        result = _load_component_stories(tmp_path, {"stories": "nonexistent.json"})
        assert result == []

    def test_no_stories_key_returns_empty(self, tmp_path):
        assert _load_component_stories(tmp_path, {}) == []


class TestLoadComponentControls:
    def test_inline_controls_dict(self, tmp_path):
        metadata = {"cotton": {"controls": {"label": {"type": "text"}}}}
        result = _load_component_controls(tmp_path, metadata)
        assert result == {"label": {"type": "text"}}

    def test_controls_from_file(self, tmp_path):
        controls_data = {"label": {"type": "text"}}
        (tmp_path / "controls.json").write_text(json.dumps(controls_data))
        result = _load_component_controls(tmp_path, {"cotton": {"controls": "controls.json"}})
        assert result == controls_data

    def test_missing_controls_file_returns_empty(self, tmp_path):
        result = _load_component_controls(tmp_path, {"cotton": {"controls": "missing.json"}})
        assert result == {}

    def test_no_cotton_key_returns_empty(self, tmp_path):
        assert _load_component_controls(tmp_path, {}) == {}


class TestFoundationFromMetadata:
    def test_valid_foundation(self):
        result = _foundation_from_metadata(
            {"slug": "colors", "label": "Colors", "template": "storybook/foundations/colors/page.html", "order": 10}
        )
        assert result is not None
        assert result["slug"] == "colors"
        assert result["type"] == "page"
        assert result["_order"] == 10
        assert result["stories"] == []

    def test_missing_slug_returns_none(self):
        assert _foundation_from_metadata({"label": "X", "template": "t.html"}) is None

    def test_missing_label_returns_none(self):
        assert _foundation_from_metadata({"slug": "x", "template": "t.html"}) is None

    def test_missing_template_returns_none(self):
        assert _foundation_from_metadata({"slug": "x", "label": "X"}) is None


class TestComponentFromMetadata:
    def test_valid_component(self, tmp_path):
        metadata = {
            "slug": "button",
            "label": "Button",
            "type": "component",
            "order": 240,
            "stories": [],
            "cotton": {"template": "ds/button/index.html"},
        }
        path = tmp_path / "component.json"
        path.write_text("{}")
        result = _component_from_metadata(path, metadata)
        assert result is not None
        assert result["slug"] == "button"
        assert result["has_react"] is False
        assert result["_order"] == 240

    def test_with_react_preview(self, tmp_path):
        metadata = {
            "slug": "button",
            "label": "Button",
            "stories": [],
            "react": {"preview": "stories/react.preview.ts"},
            "cotton": {"template": "ds/button/index.html"},
        }
        path = tmp_path / "component.json"
        path.write_text("{}")
        result = _component_from_metadata(path, metadata)
        assert result["has_react"] is True

    def test_missing_slug_returns_none(self, tmp_path):
        path = tmp_path / "component.json"
        path.write_text("{}")
        assert _component_from_metadata(path, {"label": "X"}) is None

    def test_missing_label_returns_none(self, tmp_path):
        path = tmp_path / "component.json"
        path.write_text("{}")
        assert _component_from_metadata(path, {"slug": "x"}) is None
