module.exports=(input)=>{
  let embed={
    fields:[],
    files:[]
  }
  if(input.title){embed.title=input.title}
  if(input.footer){embed.footer={text:input.footer}}
  if(input.color){embed.color=input.color}
  if(input.description){embed.description=input.description}
  if(input.thumbnail){embed.thumbnail=input.thumbnail}
  if(input.author){embed.author=input.author}
  if(input.image){embed.image=input.image}
  if(input.url){embed.url=input.url}
  if(input.fields){
    Object.keys(input.fields).forEach(key=>{
      embed.fields.push({name:key,value:input.fields[key],inline:true})
    })
  }
  return {embed:embed}
}
