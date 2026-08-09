export function register(user) {

    const users = JSON.parse(
        localStorage.getItem("careeros_users") || "[]"
    );

    const exists = users.find(
        u => u.email === user.email
    );

    if (exists) {

        return {

            success: false,

            message: "Email already exists"

        };

    }

    users.push(user);

    localStorage.setItem(
        "careeros_users",
        JSON.stringify(users)
    );

    return {

        success: true

    };

}

export function login(email, password) {

    const users = JSON.parse(
        localStorage.getItem("careeros_users") || "[]"
    );

    const user = users.find(

        u =>
            u.email === email &&
            u.password === password

    );

    if (!user) {

        return null;

    }

    localStorage.setItem(

        "careeros_current_user",

        JSON.stringify(user)

    );

    return user;

}

export function logout() {

    localStorage.removeItem(

        "careeros_current_user"

    );

}

export function getCurrentUser() {

    return JSON.parse(

        localStorage.getItem(

            "careeros_current_user"

        )

    );

}