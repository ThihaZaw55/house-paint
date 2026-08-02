export default function PageTitle({title} : {title : string}){
    return(
        <>
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">{title}</h2>
        </>
    )
}