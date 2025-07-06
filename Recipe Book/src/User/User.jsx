import { useParams } from "react-router-dom"


function User(){
    const {id} = useParams()
    // 'id' should be same as written in main.jsx after colon
    return (
        <div className="bg-gray-600 text-white text-center m-20 rounded-3xl p-10 text-4xl">User: {id}</div>
    )
}
export default User
