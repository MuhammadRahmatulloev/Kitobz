const Button = ({ children, variant = "primary", size = "md", disabled, onClick, type = "button", fullWidth }) => {
    const classes = [
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? "btn--full" : "",
        disabled ? "btn--disabled" : ""
    ].filter(Boolean).join(" ")

    return (
        <button type={type} className={classes} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button