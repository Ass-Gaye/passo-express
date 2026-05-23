import { Link } from 'react-router-dom';

const Navbar = () => {
    return(
        
        <nav className='bg-black text-white p-4 flex gap-4'>
            <Link to="/"> Home </Link>

            <Link to="/fares"> Fares </Link>

            <Link to="/create-fare"> Create Fare</Link>

            <Link to="/localities"> Localities </Link>
        </nav>

    )
    
}

export default Navbar