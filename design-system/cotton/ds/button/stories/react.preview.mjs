function resolveClass(args) {
  return args.variant === "secondary" ? "ds-button ds-button--secondary" : "ds-button ds-button--primary";
}

function renderButton(context) {
  const args = context?.args ?? {};
  const label = typeof args.label === "string" && args.label.trim() ? args.label : "Button";
  const className = resolveClass(args);
  const disabled = args.disabled ? "disabled" : "";

  return `<button class="${className}" type="button" ${disabled}>${label}</button>`;
}

export const stories = {
  default: {
    render(context) {
      return renderButton(context);
    }
  },
  secondary: {
    render(context) {
      return renderButton(context);
    }
  }
};
