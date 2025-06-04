import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/input/PasswordInput'
import { Link } from 'react-router-dom'
import { validateEmail } from '../../utils/helper';

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSignUp = async(e) => {
        e.preventDefault();
        if(!username) {
            setError("Please enter your username");
            return;
        } 

        if(!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if(!password) {
            setError("Please enter the password");
            return;
        }
        setError(null);
    }
  return (
    <>
        <Navbar />

        <div className='flex justify-center items-center mt-20'>
            <div className='w-96 border rounded bg-white px-7 py-10'>
                <form onSubmit={handleSignUp}>
                    <h4 className='text-2xl mb-7'>Sign Up</h4>
                    <input 
                        className='input-box' 
                        type='text' 
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type='text' 
                        placeholder='Email' 
                        className='input-box'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <PasswordInput 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                    <button type='submit' className='btn-primary'>Sign Up</button>

                    <p className='text-sm text-center mt-4'>
                        Already have an account? {""}
                        <Link to="/login" className='font-medium text-primary underline'>
                            Login
                        </Link>
                    </p>
                </form>

            </div>
        </div>
    </>
  )
}

export default SignUp