export default function PageTitle({title} : {title : string}){
    return(
       <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-3">{title}</h2>
        </div>
    )
}