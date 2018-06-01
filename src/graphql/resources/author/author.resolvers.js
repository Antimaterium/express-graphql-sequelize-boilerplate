import { handleError }  from '../../../utils/utils.js'

export const authorResolvers = {

	Author: {
		books: async (author, {first = 0 , limit = 10}, {db}, info) => {		
			try {
				const book = await db.Book.findAll({
					where: {author: author.get('id')},
					limit: limit,
					offset: first
				});
				return book;
			} catch(err) {				
				handleError(err);
			}
		}
	},

	Query: {
		author: async (parent, {id}, {db} , info) => {
			id = parseInt(id);
			try {
				const author = await db.Author.findById(id);
				return author;
			} catch(err) {
				handleError(err);
			} 
		},
		authors: async (author, { first = 0, limit = 10 }, {db} , info) => {
			try {
				const authors = await db.Author.findAll({
					limit: limit,
					offset: first
				});
				return authors;
			} catch(err) {
				handleError(err);
			} 
		}
	},

	Mutation: {
		createAuthor: async (author, { input }, { db }, info) => {
			const transaction = db.sequelize.transaction()
																				.then(t => t)
																				.catch(err => handleError(err));
			try {
				const author = await db.Author.create(input, { transaction });
				return author;
			} catch(err) {
				handleError(err);
			}	
			
		},
		updateAuthor: async (parent, { id, input }, { db }, info) => {
			id = parseInt(id);
			const transaction = db.sequelize.transaction()
																				.then(t => t)
																				.catch(err => handleError(err));
			try {
				const author 		= await db.Author.findById(id);
											
				if(!author) throw new Error(`Author with id ${id} not find!`);

				const result  = await author.update(input, { transaction }); 
				transaction.commit();                   
				return result;
			}
			catch(err) {
				transaction.roolback();
				handleError(err);
			}            
		},
		deleteAuthor: async (parent, { id }, { db }, info) => {
			id = parseInt(id);
			const transaction = db.sequelize.transaction()
																				.then(t => t)
																				.catch(err => handleError(err));
			try {
				const author 		= await db.Author.findById(id);	

				if(!author) throw new Error(`Author with id ${id} not find!`);

				const result  = await author.destroy({ transaction })
				transaction.commit();                   
				return result;
			}
			catch(err) {
				transaction.roolback();
				handleError(err);
			}			
		}
	}
};