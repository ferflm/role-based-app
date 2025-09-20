"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            setError("");
            const res = await fetch("/api/Users", {
                method: "POST",
                body: JSON.stringify({ formData }),
                "content-type": "application/json",
            });
            if (res.ok) {
                router.push("/");
            } else {
                const data = await res.json();
                setError(data.message);
            }
    };

    return (
        <>
            <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-3 w-1/2">
                <h1>Create New User</h1>
                <label htmlFor="">Full Name</label>
                <input type="text" id='name' name="name" onChange={handleChange} required={true} value={formData.name} className="m-2 bg-slate-500 rounded-4xl"/>
                <label htmlFor="">Email</label>
                <input type="email" id='email' name="email" onChange={handleChange} required={true} value={formData.email} className="m-2 bg-slate-500 rounded-4xl"/>
                <label htmlFor="">Password</label>
                <input type='password' id='password' name="password" onChange={handleChange} required={true} value={formData.password} className="m-2 bg-slate-500 rounded-4xl"/>
                <input type="submit" value="Create User" className="bg-amber-300 hover:bg-blue-400"/>
            </form>
            <p className="text-red-500">{ error }</p>
        </>
    );
};

export default UserForm;