const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasepath = path.join(__dirname, 'moviesData.db')
const app = express()
app.use(express.json())

const database = null

const initializeDbAndServer = async () => {
  try {
    database = open({
      filename: databasepath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (error) {
    console.log(`DB error : ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

const convertDBObjectToResponseObject = DBobject => {
  return {
    moviename: DBobject.movie_name,
  }
}

const convertDBObjectToObject = DBobject => {
  return {
    directorID: DBobject.director_id,
    directorName: DBobject.director_name,
  }
}

app.get('/movies/', async (request, response) => {
  const getmoviesquery = `
    SELECT
     *
    FROM
     movie;`
  const moviesarray = await database.all(getmoviesquery)
  response.send(
    moviesarray.map(eachPlayer => convertDBObjectToResponseObject(eachPlayer)),
  )
})

app.post('/movies/', async (request, response) => {
  const {directorID, movieName, leadActor} = request.body
  const postmoviesquery = `
  INSERT INTO 
    movie(directorID,movieName,leadActor)
  VALUES 
  ('${directorID}','${movieName}','${leadActor}')`
  const movieposting = await database.run(postmoviesquery)
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getmoviequery = `
  SELECT 
   *
   FROM 
    movie
  WHERE movie_id=${movieid}`

  const moviedetails = await database.get(getmoviequery)
  response.send(convertDBObjectToResponseObject(moviedeta))
})

app.put('/movies/:movieId/', async (request, response) => {
  const {directorID, movieName, leadActor} = request.body
  const {movieId} = request.params
  const getmoviequery = `
  UPDATE 
   movie 
   SET 
  directorId = '${directorID}',
  movieName = '${movieName}',
  leadActor = '${leadActor}'
  WHERE 
  movie_id=${movieId}`

  await database.run(getmoviequery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deletemovieQuery = `
    DELETE FROM
      book
    WHERE
      movie_id = ${movieId};`
  await db.run(deletemovieQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getdirectorquery = `
    SELECT
     *
    FROM
     director;`
  const directorarray = await database.all(getdirectorquery)
  response.send(convertDBObjectToObject(directorarray))
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {movieId} = request.params
  const getmoviequery = `
  SELECT 
   *
   FROM 
    movie
  WHERE movie_id=${movieid}`

  const moviedetails = await database.get(getmoviequery)
  response.send(convertDBObjectToResponseObject(moviedeta))
})

module.exports = app
