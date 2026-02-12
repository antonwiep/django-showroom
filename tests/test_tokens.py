"""Tests for storybook.catalog.tokens."""

from storybook.catalog.tokens import (
    TOKEN_PATTERN,
    _color_group,
    _sort_token_name,
    _token_px_value,
    get_color_token_groups,
    get_text_tokens,
    get_token_map,
)


class TestTokenPattern:
    def test_matches_simple_token(self):
        line = "  --color-slate-50: oklch(0.984 0.003 247.858);"
        match = TOKEN_PATTERN.search(line)
        assert match is not None
        assert match.group(1) == "--color-slate-50"
        assert match.group(2).strip() == "oklch(0.984 0.003 247.858)"

    def test_matches_px_value(self):
        line = "  --text-sm: 13px;"
        match = TOKEN_PATTERN.search(line)
        assert match is not None
        assert match.group(1) == "--text-sm"

    def test_does_not_match_comment(self):
        line = "  /* --not-a-token: value; */"
        match = TOKEN_PATTERN.search(line)
        assert match is None


class TestColorGroup:
    def test_slate_prefix(self):
        assert _color_group("--color-slate-500") == "slate"

    def test_blue_prefix(self):
        assert _color_group("--color-blue-600") == "blue"

    def test_amber_prefix(self):
        assert _color_group("--color-amber-300") == "amber"

    def test_red_prefix(self):
        assert _color_group("--color-red-600") == "red"

    def test_green_prefix(self):
        assert _color_group("--color-green-500") == "green"

    def test_alpha_prefix(self):
        assert _color_group("--color-alpha-10") == "alpha"

    def test_unknown_prefix(self):
        assert _color_group("--color-xyz-100") == "other"


class TestSortTokenName:
    def test_numeric_suffix_sorts_numerically(self):
        result_50 = _sort_token_name("slate-50")
        result_100 = _sort_token_name("slate-100")
        assert result_50 < result_100

    def test_no_numeric_suffix(self):
        result = _sort_token_name("primary")
        assert result == ("primary", -1, "primary")


class TestTokenPxValue:
    def test_valid_px(self):
        assert _token_px_value("13px") == 13.0

    def test_decimal_px(self):
        assert _token_px_value("0.5px") == 0.5

    def test_non_px_returns_inf(self):
        assert _token_px_value("var(--something)") == float("inf")

    def test_empty_string_returns_inf(self):
        assert _token_px_value("") == float("inf")


class TestGetTokenMapIntegration:
    def test_returns_nonempty_dict(self):
        token_map = get_token_map()
        assert isinstance(token_map, dict)
        assert len(token_map) > 0

    def test_contains_color_tokens(self):
        token_map = get_token_map()
        color_tokens = [k for k in token_map if k.startswith("--color-slate-")]
        assert len(color_tokens) > 0


class TestGetColorTokenGroupsIntegration:
    def test_returns_ordered_groups(self):
        groups = get_color_token_groups()
        assert isinstance(groups, list)
        assert len(groups) > 0

    def test_each_group_has_required_keys(self):
        groups = get_color_token_groups()
        for group in groups:
            assert "key" in group
            assert "label" in group
            assert "tokens" in group
            assert isinstance(group["tokens"], list)


class TestGetTextTokensIntegration:
    def test_returns_list(self):
        tokens = get_text_tokens()
        assert isinstance(tokens, list)
        assert len(tokens) > 0

    def test_each_token_has_required_keys(self):
        tokens = get_text_tokens()
        for token in tokens:
            assert "name" in token
            assert "size_var" in token
            assert "size_value" in token
