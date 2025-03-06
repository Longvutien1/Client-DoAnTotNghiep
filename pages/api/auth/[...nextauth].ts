import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<string, string> | undefined) {
                if (!credentials) return null; // Kiểm tra credentials có tồn tại hay không

                if (credentials.username === "admin" && credentials.password === "password") {
                    return { id: "1", name: "Admin" };
                }
                return null;
            }
        }),
    ]
    ,
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    }
});
