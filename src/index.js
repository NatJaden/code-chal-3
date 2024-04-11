// Your code here
document.addEventListener("DOMContentLoaded", function () {
    // Function thats upadates the movies in the movie section
    function updateMovieDetails(movie) {
      const posterImg = document.getElementById("poster");
      posterImg.src = movie.poster;
  
      const titleElement = document.getElementById("title");
      titleElement.textContent = movie.title;
  
      const runtimeElement = document.getElementById("runtime");
      runtimeElement.textContent = `${movie.runtime} minutes`;
  
      const showtimeElement = document.getElementById("showtime");
      showtimeElement.textContent = movie.showtime;
  
      const availableTickets = movie.capacity - movie.tickets_sold;
      const ticketNumElement = document.getElementById("ticket-num");
      ticketNumElement.textContent = availableTickets;
  
      //  Buy ticket button that  allows the user to buy tickets
      const buyTicketButton = document.getElementById("buy-ticket");
      if (availableTickets === 0) {
        document.getElementById("buy-ticket").textContent = "Sold Out";
        document.getElementById("buy-ticket").disabled = true;
      } else {
        document.getElementById("buy-ticket").textContent = "Buy Ticket";
        document.getElementById("buy-ticket").disabled = false;
      }
    }
  
    // Function to populate the movie menu
    function populateMovieMenu(movies) {
      const filmsList = document.getElementById("films");
  
      movies.forEach((movie) => {
        const listItem = document.createElement("li");
        listItem.classList.add("film", "item");
        if (movie.capacity - movie.tickets_sold <= 0) {
          listItem.classList.add("sold-out");
        }
        listItem.textContent = movie.title;
        listItem.addEventListener("click", function () {
          updateMovieDetails(movie); // Pass the movie object to updateMovieDetails
        });
        filmsList.appendChild(listItem);
      });
    }
  
    // Function to buy tickets for a movie
    document.getElementById("buy-ticket").addEventListener("click", function () {
      fetch(`http://localhost:3000/films/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tickets_sold:
            parseInt(document.getElementById("ticket-num").textContent) + 1,
        }),
      })
        .then((response) => response.json())
        .then((updatedMovie) => {
          updateMovieDetails(updatedMovie);
        })
        .catch((error) => {
          console.error("Error updating tickets_sold on the server:", error);
        });
    });
  
    // Function to delete a film from the server
    function deleteFilm(id) {
      fetch(`http://localhost:3000/films/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete film from the server");
          }
          return response.json();
        })
        .then(() => {
          // Remove the film from the menu
          const filmItem = document.querySelector(`#films li[data-id="${id}"]`);
          if (filmItem) {
            filmItem.remove();
          }
        })
        .catch((error) => {
          console.error("Error deleting film:", error);
        });
    }
  
    // Fetch movie data for the first movie
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((data) => {
        updateMovieDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
      });
  
    // Fetch all movies for the movie menu
    fetch("http://localhost:3000/films")
      .then((response) => response.json())
      .then((data) => {
        populateMovieMenu(data);
      })
      .catch((error) => {
        console.error("Error fetching movie data:", error);
      });
    deleteFilm("");
  });
  