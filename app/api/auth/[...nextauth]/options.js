import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/app/(models)/User';
import bcrypt from 'bcrypt';

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
        GitHubProvider({
            profile(profile) {
                console.log(profile);

                let userRole = "GitHub User";
                if (profile?.email == "ferflmtzzz@gmail.com") {
                    userRole = "admin";
                }

                return {
                    ...profile,
                    role: userRole,
                };
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            profile(profile) {
                console.log(profile);

                let userRole = "Google User";

                return {
                    ...profile,
                    id: profile.sub,
                    role: userRole,
                };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "your email" },
                password: { label: "Password", type: "password", placeholder: "your password" },
            },
            async authorize(credentials) {
                try {
                    const foundUser = await User.findOne({ email: credentials.email });
                    if (foundUser) {
                        const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.password);
                        if (isPasswordValid) {
                            const userRole = foundUser.role || "user";
                            delete foundUser.password; // Remove password before returning user object

                            foundUser["role"] = "Unverified Email"; // Attach role to user object
                            return foundUser;
                        }
                    }
                } catch (error) {
                    console.error("Error in authorize:", error);
                    return null;
                }
                return null;
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },

        async session ({ session, token }) {
            if (session?.user) session.user.role = token.role;
            return session;
        },
    },
};