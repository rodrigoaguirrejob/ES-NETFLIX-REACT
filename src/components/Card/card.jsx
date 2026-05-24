export function Card({ children, className = "", onClick }) {
    return (
        <div 
          className={`bg-red rounded-2xl shadow ${className} hover:scale-105 transition-transform duration-300 cursor-pointer`}
          onClick={onClick}
        >
            {children}
        </div>
    );
}
