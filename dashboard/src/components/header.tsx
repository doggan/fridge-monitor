import {Icon} from "@tremor/react";
import {LogoutIcon, UserIcon} from "@heroicons/react/outline";
import {useUser} from "@auth0/nextjs-auth0/client";

const Login = () => {
    const { user, error, isLoading } = useUser();

    if (isLoading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>{error.message}</div>
    }

    // user?.picture

    if (!user) {
        return (
            <div className={"flex"}>
                <Icon className={"pt-1"} icon={UserIcon} />
                <a href={"/api/auth/login"}>Log In</a>
            </div>
        );
    }

    return (
        <div className={"flex items-center gap-4"}>
            {user.picture ?
                <img className="w-10 h-10 rounded-full" src={user.picture} alt="User avatar"/> :
                <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20"
                         xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clip-rule="evenodd"></path>
                    </svg>
                </div>
            }
            <div>
                <div>{user.name}</div>
                <div className={"text-sm text-gray-500"}>{user.email}</div>
            </div>

            <div className={""}>
                <Icon className={"pt-1"} icon={LogoutIcon} />
                <a className={"text-sm"} href={"/api/auth/logout"}>Log Out</a>
            </div>
         </div>
    );
}

export function Header() {
    return (
        <section className="flex">
            <div className={"w-2/3"}>
                <div className={"text-lg sm:text-3xl"}>Fridge Monitor ❄️</div>
                <div className={"text-gray-500 text-sm"}>A dashboard for viewing refrigerator metrics.</div>
            </div>
            <div className={"w-1/3"}>
                <Login />
            </div>
        </section>
    )
}
