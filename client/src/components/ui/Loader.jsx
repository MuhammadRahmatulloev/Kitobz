const Loader = ({ fullPage }) => {
    if (fullPage) {
        return (
            <div className="loader-fullpage">
                <div className="loader-spinner"></div>
            </div>
        )
    }
    return (
        <div className="loader-wrap">
            <div className="loader-spinner"></div>
        </div>
    )
}

export default Loader