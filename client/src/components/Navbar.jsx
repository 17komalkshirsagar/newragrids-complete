import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserPlus, User, LogOut, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const navLinks = [
        // { name: "Home", path: "/" },
        // { name: "About", path: "/about" },
        // { name: "Calculator", path: "/calculator" },
        // { name: "Contact", path: "/contact" },
        // { name: "KnowYour", path: "/knowyour" }
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src="/favicon.ico"
                            alt="NewRa Grids Logo"
                            className="h-8 w-8 object-contain dark:brightness-150 dark:contrast-125"
                        />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] bg-clip-text text-transparent">
                            NewRa Grids
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#28B8B4] dark:hover:text-[#28B8B4] transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        {/* User Profile or Login Button */}
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            
                            {user ? (
                                // User is logged in - Show Profile Dropdown
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-10 w-10 rounded-full p-0 hover:bg-[#28B8B4]/10 dark:hover:bg-[#28B8B4]/20 transition-colors duration-200"
                                        >
                                            {/* Profile Icon with User Initial - ONLY WHEN USER IS LOGGED IN */}
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white text-sm font-semibold shadow-md">
                                                {user.name ? (
                                                    user.name.charAt(0).toUpperCase()
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                                                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/UserProfile" className="cursor-pointer w-full">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/" className="cursor-pointer w-full">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={handleLogout}
                                            className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 w-full"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                // User is not logged in - Show ONLY Login Button (NO profile icon)
                                <Button
                                    asChild
                                    variant="outline"
                                    className="border-[#2D50A1] text-[#2D50A1] hover:bg-[#2D50A1] hover:text-white transition-all duration-300 font-medium"
                                >
                                    <Link to="/UserLogin" className="flex items-center gap-2">
                                        <UserPlus className="w-4 h-4" />
                                        Login
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center space-x-2">
                        <ThemeToggle />
                        
                        {/* Mobile Profile Icon - ONLY WHEN USER IS LOGGED IN */}
                        {user && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white text-sm font-semibold">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                            </div>
                        )}
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden"
                        >
                            <div className="flex flex-col space-y-4 pb-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className="text-sm font-medium transition-colors hover:text-[#28B8B4]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                
                                {/* Mobile Login/Profile */}
                                {user ? (
                                    <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center space-x-3 px-2 py-1">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] text-white text-sm font-semibold">
                                                {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.name || "User"}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Profile Links */}
                                        <Link 
                                            to="/UserProfile" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#28B8B4] dark:hover:text-[#28B8B4] px-2 py-1 rounded-lg transition-colors duration-200"
                                        >
                                            <User className="h-4 w-4" />
                                            Profile
                                        </Link>
                                        
                                        <Link 
                                            to="/" 
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#28B8B4] dark:hover:text-[#28B8B4] px-2 py-1 rounded-lg transition-colors duration-200"
                                        >
                                            <Settings className="h-4 w-4" />
                                            Settings
                                        </Link>
                                        
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                                setIsOpen(false);
                                            }}
                                            variant="outline"
                                            className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 mt-2"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                ) : (
                                    // Mobile Login Button - NO profile icon
                                    <Button
                                        asChild
                                        className="bg-gradient-to-r from-[#2D50A1] to-[#28B8B4] hover:from-[#2D50A1] hover:to-[#28B8B4] text-white mt-2 border-0"
                                    >
                                        <Link to="/UserLogin" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2">
                                            <UserPlus className="w-4 h-4" />
                                            Login
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}