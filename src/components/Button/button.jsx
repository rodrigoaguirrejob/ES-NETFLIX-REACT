import { useNavigate } from "react-router-dom";

export function Button({ children, className = "", linkto, ...props }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (linkto) {
            e.preventDefault();
            navigate(linkto);
            window.scrollTo(0, 0);
        }
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <button
            className={`bg-red-600 px-4 py-2 rounded-xl shadow font-medium ${className} text-white hover:bg-red-900 transition-colors duration-300`}
            {...props}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}