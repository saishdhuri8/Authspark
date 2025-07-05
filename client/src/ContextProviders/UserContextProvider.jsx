
import { useState } from 'react'

import UserContext from '../context/UserContext'

const UserContextProvider = ({ children }) => {
    const [userId, setuserId] = useState(null);
    const [email, setemail] = useState(null);
    const [name, setname] = useState(null);
    return (
        <UserContext.Provider value={{ userId, setuserId, email, setemail, name, setname }}>
            {children}
        </UserContext.Provider>

    )
}

export default UserContextProvider
