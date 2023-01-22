import PropTypes from "prop-types";

const Card = ({ title, onClick, children }) => {
    return (
        <div
            onClick={onClick}
            className="card mb-3 cursor-pointer">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div>{title}</div>
                    {children && <div>{children}</div>}
                </div>
            </div>
        </div>
    )
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    onClick: PropTypes.func,
};

Card.defaultProps = {
    children: null,
    onClick: () => { },
}

export default Card;