import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-700 text-center p-4 mt-4">
            &copy; {new Date().getFullYear()} EventTicket. All rights reserved.
        </footer>
    )
}
export default Footer
