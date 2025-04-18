
import dbConnect from "../db";
import Category from "../db/models/Category.ts"
import Tag from "../db/models/Tag.ts"
import Note from "../db/models/Note.ts"


async function seedCategories(){
  const categories = ['react','vue','nodejs','前端'].map(item=>{
    return {
      name:item,
    }
  })
  await Category.insertMany(categories)
}

async function seedTags(){
  const tags = ['个人','工作','日常'].map(item=>{
    return {
      name:item,
    }
  })
  await Tag.insertMany(tags)
}
async function seedNotes(){
  const notes = [
    {
      title:'react',
      content:'react is a js library for building user interfaces',
      category:Category.findOne({name:'react'}),
      tags:['react'],
    },
    {
      title:'vue',
      content:'vue is a js library for building user interfaces',
      category:Category.findOne({name:'vue'}),
      tags:['vue'],
    },
    {
      title:'nodejs',
      content:'nodejs is a js library for building user interfaces',
      category:Category.findOne({name:'nodejs'}),
      tags:['nodejs'],
    },
  ]
  await Note.insertMany(notes)
}

async function main() {
  await dbConnect();
  await seedCategories()
  await seedTags()
  await seedNotes()
}

main().then(res=>{
  console.log("seed success");
}).catch(err=>{
  console.log("seed error",err);
})