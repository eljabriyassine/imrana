// ========================================
// SITE SETTINGS
// ========================================

var SITE = {
  email: "Imranarhasan@gmail.com",
  whatsapp: "+212 665-448143"
};


// ========================================
// WHATSAPP LINK
// ========================================

var whatsappLink = document.getElementById("whatsapp-link");
var whatsappNumber = SITE.whatsapp.replace(/\D/g, "");

if (whatsappLink && whatsappNumber) {
  whatsappLink.href = "https://wa.me/" + whatsappNumber;
  whatsappLink.hidden = false;

  var whatsappNote = document.getElementById("whatsapp-note");

  if (whatsappNote) {
    whatsappNote.hidden = true;
  }
}


// ========================================
// EMAIL LINK
// ========================================

var emailLink = document.getElementById("email-link");

if (emailLink && SITE.email) {
  emailLink.href = "mailto:" + SITE.email;
  emailLink.hidden = false;

  var emailNote = document.getElementById("email-note");

  if (emailNote) {
    emailNote.hidden = true;
  }
}


// ========================================
// MOBILE MENU
// ========================================

var burger = document.querySelector(".burger");
var navList = document.querySelector("nav ul");

if (burger && navList) {
  burger.addEventListener("click", function () {
    navList.classList.toggle("open");
  });
}


// ========================================
// CERTIFICATE POPUP
// ========================================

var dialog = document.getElementById("lb");

if (dialog) {
  var certificateImage = dialog.querySelector("img");
  var closeButton = dialog.querySelector("button");

  // Open certificate when clicking an image or button
  document.querySelectorAll(".report").forEach(function (button) {

    button.addEventListener("click", function () {

      var certificate = button.dataset.full;
      var description = button.dataset.alt || "Student certificate";

      if (!certificate) {
        return;
      }

      certificateImage.src = certificate;
      certificateImage.alt = description;

      dialog.showModal();

    });

  });

  // Close button
  if (closeButton) {
    closeButton.addEventListener("click", function () {
      dialog.close();
    });
  }

  // Close when clicking outside the image
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  // Clear image after closing
  dialog.addEventListener("close", function () {
    certificateImage.src = "";
  });
}


// ========================================
// CONTACT FORM
// ========================================

var f = document.getElementById("contact");

if (f) {
  f.onsubmit = function (e) {
    e.preventDefault();

    var n = document.getElementById("msg");

    if (!SITE.email) {
      if (n) {
        n.textContent =
          "Messaging is not switched on yet. Please check back soon.";
      }
      return;
    }

    location.href =
      "mailto:" +
      SITE.email +
      "?subject=" +
      encodeURIComponent(
        "Enquiry from " +
          f.elements.namedItem("name").value +
          " (" +
          f.elements.namedItem("goal").value +
          ")"
      ) +
      "&body=" +
      encodeURIComponent(
        f.elements.namedItem("message").value +
          "\n\n" +
          f.elements.namedItem("email").value
      );
  };
}


// ========================================
// SCROLL REVEALS
// ========================================

var rm = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if ("IntersectionObserver" in window && !rm) {

  var io = new IntersectionObserver(
    function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }

      });

    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach(function (element) {
    io.observe(element);
  });

} else {

  document.querySelectorAll(".reveal").forEach(function (element) {
    element.classList.add("in");
  });

}


// ========================================
// SCORE COUNT-UP
// ========================================

if (!rm) {

  document.querySelectorAll("[data-n]").forEach(function (element) {

    var target = parseFloat(element.dataset.n);
    var start = performance.now() + 300;

    (function animate(now) {

      var progress = Math.min(
        Math.max((now - start) / 1100, 0),
        1
      );

      element.textContent = (
        target * (1 - Math.pow(1 - progress, 3))
      ).toFixed(1);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }

    })(performance.now());

  });

}


// ========================================
// SKILL TABS
// ========================================

document.querySelectorAll("[role=tablist]").forEach(function (list) {

  var tabs = [].slice.call(
    list.querySelectorAll("[role=tab]")
  );

  function go(index) {

    tabs.forEach(function (button, j) {

      var active = index === j;

      button.setAttribute("aria-selected", active);
      button.tabIndex = active ? 0 : -1;

      var panel = document.getElementById(
        button.getAttribute("aria-controls")
      );

      if (panel) {
        panel.hidden = !active;
      }

    });

    tabs[index].focus();

  }

  tabs.forEach(function (button, index) {

    button.tabIndex = index ? -1 : 0;

    button.onclick = function () {
      go(index);
    };

    button.onkeydown = function (event) {

      if (event.key === "ArrowRight") {
        go((index + 1) % tabs.length);
      }

      if (event.key === "ArrowLeft") {
        go((index + tabs.length - 1) % tabs.length);
      }

    });

  });

});


// ========================================
// REVIEW FORM
// ========================================

var reviewForm = document.getElementById("review-form");

if (reviewForm) {

  var reviewList = document.getElementById("review-list");
  var reviewStatus = document.getElementById("review-status");

  var reviewStorageKey = "imrana-reviews";
  var reviews = [];

  try {

    var storedReviews = localStorage.getItem(reviewStorageKey);
    var parsedReviews = storedReviews
      ? JSON.parse(storedReviews)
      : [];

    if (Array.isArray(parsedReviews)) {

      reviews = parsedReviews.filter(function (review) {

        return (
          review &&
          typeof review.name === "string" &&
          typeof review.message === "string" &&
          Number.isInteger(review.rating) &&
          review.rating >= 1 &&
          review.rating <= 5
        );

      });

    }

  } catch (error) {
    reviews = [];
  }


  function renderReviews() {

    reviewList.replaceChildren();

    if (!reviews.length) {

      var emptyState = document.createElement("p");

      emptyState.className = "review-empty";

      emptyState.textContent =
        "No reviews yet. Be the first to share your experience.";

      reviewList.appendChild(emptyState);

      return;
    }


    reviews.forEach(function (review) {

      var card = document.createElement("article");
      card.className = "review-card";

      var header = document.createElement("div");
      header.className = "review-meta";

      var name = document.createElement("strong");
      name.textContent = review.name;

      var rating = document.createElement("span");
      rating.className = "review-rating";
      rating.textContent = review.rating + " out of 5";

      var message = document.createElement("p");
      message.textContent = review.message;

      header.append(name, rating);
      card.append(header, message);

      if (review.submittedAt) {

        var date = new Date(review.submittedAt);

        if (!Number.isNaN(date.getTime())) {

          var dateLabel = document.createElement("time");

          dateLabel.className = "review-date";
          dateLabel.dateTime = review.submittedAt;
          dateLabel.textContent = date.toLocaleDateString();

          card.appendChild(dateLabel);

        }

      }

      reviewList.appendChild(card);

    });

  }


  renderReviews();


  reviewForm.addEventListener("submit", function (event) {

    event.preventDefault();

    var formValues = new FormData(reviewForm);

    var review = {

      name: String(formValues.get("name")).trim(),

      rating: Number(formValues.get("rating")),

      message: String(formValues.get("message")).trim(),

      submittedAt: new Date().toISOString()

    };


    if (
      !review.name ||
      !review.message ||
      !Number.isInteger(review.rating) ||
      review.rating < 1 ||
      review.rating > 5
    ) {
      return;
    }


    reviews.unshift(review);
    reviews = reviews.slice(0, 100);


    try {

      localStorage.setItem(
        reviewStorageKey,
        JSON.stringify(reviews)
      );

    } catch (error) {

      reviews.shift();

      if (reviewStatus) {
        reviewStatus.textContent =
          "This browser could not save the review. Please try again.";
      }

      return;
    }


    renderReviews();

    reviewForm.reset();

    if (reviewStatus) {
      reviewStatus.textContent =
        "Thank you. Your review has been added in this browser.";
    }

  });

}


// ========================================
// READING PROGRESS BAR
// ========================================

var pb = document.createElement("div");

pb.className = "scrollbar";

document.body.appendChild(pb);

window.addEventListener(
  "scroll",
  function () {

    var scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    var progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    pb.style.width = progress + "%";

  },
  { passive: true }
);
