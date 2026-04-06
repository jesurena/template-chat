export const handleLoginSuccess = (data: { token: string; user: { id?: string; name?: string; email?: string } }) => {
    const { token: jwtToken, user } = data;

    localStorage.setItem("jwt_token", jwtToken);
    localStorage.setItem("user_id", user.id || "");
    localStorage.setItem("uName", user.name || "");
    localStorage.setItem("uEmail", user.email || "");
    localStorage.setItem("AoId", user.id || "");

    const params = new URLSearchParams(window.location.search);
    const fromICS = params.get("from");

    if (fromICS === "ics") {
        const icsUrl = process.env.NEXT_PUBLIC_ICS_CHAT_URL || "http://localhost:3000/";
        window.location.replace(icsUrl);
    } else {
        const localUrl = process.env.NEXT_PUBLIC_LOCAL_ICS_CHAT_URL || "/";
        window.location.replace(localUrl);
    }
};

export const handleLogout = () => {
    const keysToRemove = ["jwt_token", "user_id", "uName", "uEmail", "AoId", "isFirstTime"];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    const loginUrl = "/login";
    window.location.replace(loginUrl);
};
