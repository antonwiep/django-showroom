import pytest


@pytest.fixture
def sample_component():
    """A fully-resolved component dict matching the shape returned by _component_from_metadata."""
    return {
        "slug": "button",
        "label": "Button",
        "type": "component",
        "template": "ds/button/index.html",
        "stories": [
            {
                "slug": "default",
                "name": "Default",
                "template": "cotton/ds/button/stories/button.html",
                "defaults": {"label": "Primary Button", "variant": "primary"},
                "controls": ["label", "variant", "size"],
            },
            {
                "slug": "secondary",
                "name": "Secondary",
                "template": "cotton/ds/button/stories/button.html",
                "defaults": {"label": "Secondary Button", "variant": "secondary"},
                "controls": ["label", "variant"],
            },
        ],
        "controls": {
            "label": {"name": "label", "label": "Label", "type": "text"},
            "variant": {
                "name": "variant",
                "label": "Variant",
                "type": "select",
                "options": [
                    {"value": "primary", "label": "primary"},
                    {"value": "secondary", "label": "secondary"},
                ],
            },
            "size": {
                "name": "size",
                "label": "Size",
                "type": "select",
                "options": [{"value": "large", "label": "large"}],
            },
        },
        "react": {"preview": "stories/react.preview.ts"},
        "cotton": {"template": "ds/button/index.html"},
        "has_react": True,
    }


@pytest.fixture
def sample_story():
    """A single story dict."""
    return {
        "slug": "default",
        "name": "Default",
        "template": "cotton/ds/button/stories/button.html",
        "defaults": {"label": "Primary Button", "variant": "primary"},
        "controls": ["label", "variant"],
    }
