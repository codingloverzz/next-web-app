export default async function page(){
    await new Promise((resolve, reject) =>{
        setTimeout(() => {
            resolve("")
        }, 3000);
    })
    return <div>dashboard-text</div>
}