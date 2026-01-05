import React from 'react'

const Footer = () => {
    return (
    <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold text-white mb-4">EventPass</h3>
                    <p className="text-gray-400 max-w-md">
                        Your gateway to amazing events. Discover, book, and enjoy unforgettable experiences.
                    </p>
                </div>

                <div className="flex gap-8">
                    <div>
                        <h4 className="text-white font-semibold mb-4">Links</h4>
                        <ul className="space-y-2">
                            <li>About</li>
                            <li>Events</li>
                            <li>Contact</li>
                            {/*<li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>*/}
                            {/*<li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>*/}
                            {/*<li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>*/}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Social</h4>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-white transition-colors">Facebook</a>
                            <a href="#" className="hover:text-white transition-colors">Twitter</a>
                            <a href="#" className="hover:text-white transition-colors">Instagram</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
                <p>© {new Date().getFullYear()} EventPass. All rights reserved.</p>
            </div>
        </div>
    </footer>

)
}
export default Footer
