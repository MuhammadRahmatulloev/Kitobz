const Input = ({ label, type = "text", value, onChange, placeholder, error, name }) => {
    return (
        <div className="input-wrap">
            {label && <label className="input-label">{label}</label>}
            <input
                type={type}
                name={name}
                className={`input-field ${error ? "input-field--error" : ""}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {error && <span className="input-error">{error}</span>}
        </div>
    )
}

export default Input