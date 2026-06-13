function Profile() {

return (

<div className="min-h-screen p-10">

<h1 className="text-4xl font-bold">
User Profile
</h1>

<div className="mt-8 bg-slate-900 p-6 rounded-3xl text-white">

<p>Email:</p>

<p>
{localStorage.getItem("email")}
</p>

</div>

</div>

);
}

export default Profile;