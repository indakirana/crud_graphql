const graphql = require('graphql');

const Movie = require('./movie');

 
const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt,GraphQLSchema,
    GraphQLList,GraphQLNonNull
 } = graphql;

 
//Schema defines data on the Graph like object types(book type), the relation between
//these object types and describes how they can reach into the graph to interact with
//the data to retrieve or mutate the data  

 
var fakeBookDatabase = [
   { name:"Book 1", pages:432 , id:1},
   { name: "Book 2", pages: 32, id: 2},
   { name: "Book 3", pages: 532, id: 3 }
]

 
const MovieType = new GraphQLObjectType({
    name: 'Movie',
    //We are wrapping fields in the function as we don’t want to execute this until
    //everything is inilized. For example below code will throw an error AuthorType not
    //found if not wrapped in a function
    fields: () => ({
        id: { type:GraphQLID },
        movie: { type: GraphQLString  },
        actor: { type: GraphQLString },
        author: { type: GraphQLString }
    })
 });

 
//RootQuery describes how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular book
//or get a particular author.
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getMovie:{
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movie.find({});
            }
        },
        getMovies:{
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movie.findById(args.id);
            }
        }
    }
 });

 //Very similar to RootQuery helps users to add/update to the database.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addMovie: {
            type: MovieType,
            args: {
                //GraphQLNonNull make these fields required
                movie: { type: new GraphQLNonNull(GraphQLString) },
                actor: { type: new GraphQLNonNull(GraphQLString) },
                author: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let addMovies = new Movie({
                    movie: args.movie,
                    actor: args.actor,
                    author: args.author
                });
                return addMovies.save();
            }
        },
        updateMovie: {
            type: MovieType,
            args: {
                id: {type: GraphQLID},
                movie: {type: GraphQLString},
                actor: {type:GraphQLString},
                author: {type:GraphQLString}
            },
            resolve: async (parent, args) => {
                const update_movie = await Movie.findByIdAndUpdate(args.id, {
                    movie: args.movie,
                    actor: args.actor,
                    author: args.author
                });
                return update_movie;
            }
        },
        deleteMovie: {
            type: MovieType,
            args: {id:{type: GraphQLID}},
            resolve: async (parent, args) => {
                const delete_movie = await Movie.findByIdAndDelete(args.id);
                return delete_movie;
            }
        }
    }
 });


 
//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use it when they are making requests.
module.exports = new GraphQLSchema({
   query: RootQuery,
   mutation: Mutation
});