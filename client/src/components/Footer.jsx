import { Footer } from "flowbite-react";
import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function AppFooter() {
    return (
        <Footer container={true} className="bg-gradient-to-r from-pink-300 via-pink-500 to-pink-700 text-white">
            <div className="w-full text-center p-6">
                <p className="text-lg font-semibold mb-4">✨ Follow us for more fun! ✨</p>
                <div className="flex justify-center space-x-8 my-4">
                    <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transform hover:scale-110 hover:rotate-12 transition duration-300"
                    >
                        <FaYoutube size={28} />
                    </a>
                    <a
                        href="https://www.facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transform hover:scale-110 hover:rotate-12 transition duration-300"
                    >
                        <FaFacebook size={28} />
                    </a>
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transform hover:scale-110 hover:rotate-12 transition duration-300"
                    >
                        <FaInstagram size={28} />
                    </a>
                    <a
                        href="https://www.tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transform hover:scale-110 hover:rotate-12 transition duration-300"
                    >
                        <FaTiktok size={28} />
                    </a>
                </div>
                <Footer.Copyright
                    href="#"
                    by="Your Cute Brand™"
                    year={new Date().getFullYear()}
                />
                <p className="mt-4 text-sm italic">Made with 💖 and ☕</p>
            </div>
        </Footer>
    );
}
