import LoginToggle from "./LoginToggle";
import { AnimatePresence, motion } from "framer-motion";

export default function NavbarRight({
    user,
    menuOpen,
    menuRef,
    toggleUserMenu,
    handleLogin,
    handleLogout,
    mobileMenuVariants,
    mobileMenuItemVariants,
    closeAllDropdowns,
}) {
    return (
    <div className="navbar__right">
        {!user ? (
        <LoginToggle user={user} onLogin={handleLogin} onLogout={handleLogout} variant="desktop" />
        ) : (
        <div className="relative ml-3" ref={menuRef}>
            <button type="button" onClick={toggleUserMenu} className="navbar__avatarBtn">
            <span className="sr-only">Open user menu</span>
            <img
                src={
                user.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt=""
                className="navbar__avatar"
            />
            </button>

            <AnimatePresence>
            {menuOpen && (
                <motion.div className="navbar__dropdown" variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit">
                <div className="navbar__dropdownHeader">
                    Signed in as
                    <div className="navbar__dropdownEmail">{user.email}</div>
                </div>

                <div className="px-4 py-2">
                    <motion.div variants={mobileMenuItemVariants}>
                        <LoginToggle user={user} onLogin={handleLogin} onLogout={handleLogout} variant="desktop" onClick={closeAllDropdowns}/>
                    </motion.div>
                </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
        )}
    </div>
    );
}
