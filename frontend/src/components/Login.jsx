import { FcGoogle } from "react-icons/fc";

export const Login = ({login}) => {
    return (
        <div className="flex flex-col items-center mt-5 justify-center">
            <h1 className="text-4xl">
                Calendar App
            </h1>
            <div className="w-[50%] h-[50vh] bg-slate-300 flex justify-center items-center shadow-md rounded-md mt-10">
                <button
                    onClick={login}
                    className="border border-orange-200 flex items-center justify-center gap-3 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                    <FcGoogle className="text-3xl" />
                    <span className=" text-xl">Login with Google</span>
                </button>
            </div>

        </div>
    )
}