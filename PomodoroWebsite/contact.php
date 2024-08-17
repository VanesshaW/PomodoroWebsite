
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Include SweetAlert2 CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

<!-- Include SweetAlert2 JS -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>document.addEventListener('DOMContentLoaded', function() {
    <?php if ($thankYouMessage): ?>
        Swal.fire({
            title: 'Success!',
            text: '<?php echo addslashes($thankYouMessage); ?>',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    <?php endif; ?>
});
</script>
    <title>Contact Us - DORO</title>
    <script>function OpenPage(a){
        window.location.href = a;
    }
    </script>
    <style>
         @font-face {
            font-family: 'BubbleboddyNeue';
            src: url('res/BubbleboddyNeue.ttf');
        }

        @font-face {
            font-family: 'Alata-Regular';
            src: url('res/Alata-Regular.ttf');
        }

        body {
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-image: url(res/Background/Gradient1.png);
            background-attachment: scroll;
            background-repeat: repeat;
            background-size: cover;
            font-family: 'Alata-Regular', sans-serif;
            color: white;
        }

        .content-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            /* max-width: 1300px; */
            margin: 0;
            padding: 20px;
        }

        .MenuBar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 98%;
        margin-top: 8px;
}

        .Title{
        width: fit-content;
        display: inline-block;
        color: white;
        font-family: BubbleboddyNeue;
        font-size: 65px;
        z-index: 1;
        margin-left: 1%;
        margin-top: -1%;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.64);
}

        .Right {
            display: flex;
            gap: 1rem;
        }

        .Button {
            font-family: 'Alata-regular';
    font-weight: 400;
    font-size: 25px;
    color: white;
    padding: 10px 20px;
    margin: 0 10px;
    /* padding-top: 20px;
    padding-bottom: 20px; */
    transition: all 0.3s ease;
    /* text-shadow:  5px 5px 0 rgba(0, 0, 0, 0.486); */
            cursor: pointer;
        }

        .Button:hover {
            transform: scale(1.1);
        }

        .Filled {
            border: white solid 2px;
            border-radius: 200px;
        }

        .about-section {
            display: flex;
            flex-direction: column;
            align-items:center;
            text-align: justify;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(50px);
            animation: fadeInUp 1s forwards;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .team-section {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 4rem;
        }

        .team-member {
            width: 250px;
            text-align: center;
            opacity: 0;
            transform: scale(0.8);
            animation: scaleIn 0.5s forwards;
            animation-delay: calc(var(--delay) * 0.2s);
        }

        @keyframes scaleIn {
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }

        .footer {
            width: 100%;
            background-color: #000062;
            color: #fff;
            text-align: center;
            padding: 1rem 0;
            margin-top: auto;
        }

        .footerDesc {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .footerTitle {
            font-family: BubbleboddyNeue, sans-serif;
            font-size: 2rem;
        }

        .footerContacts {
            display: flex;
            gap: 1rem;
        }

        .footerButton {
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .footerButton:hover {
            text-decoration: underline;
            transform: scale(1.1);
        }

        .footerCopyright {
            margin-top: 1rem;
        }

        @media (max-width: 768px) {
            .MenuBar {
                flex-direction: column;
                gap: 1rem;
            }

            .Right {
                flex-wrap: wrap;
                justify-content: center;
            }

            .team-section {
                flex-direction: column;
                align-items: center;
            }

            .footerDesc {
                flex-direction: column;
                gap: 1rem;
            }
        }

        .contact-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-image: linear-gradient(#816CF7, #E07DFC);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); 
    opacity: 0;
    animation: fadeIn 1s forwards;
    animation-delay: 0.5s;
}


        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 0.5rem;
            margin-bottom: 1rem;
            border: none;
            border-radius: 5px;
            background-color:rgba(255, 255, 255, 0.8);
            color: black;
        }

        .contact-form textarea {
            height: 150px;
        }

        .contact-form button {
            background-color: #000062;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .contact-form button:hover {
            background-color: #000090;
        }
    </style>
</head>
<body>
    <div class="content-wrapper">
        <div class="MenuBar">
            <a href="index.php" style="text-decoration: none" class="Title">DORO</a>
            
            <div class="Right">
                <div class="Button" id="Home" onclick="OpenPage('index.php')">Home</div>
                <div class="Button" id="Features" onclick="OpenPage('index.php')">Features</div>
                <div class="Button Filled" id="LoginButton" onclick="OpenPage('LoginRegis/Login/Login.php')" style="font-weight:bold !important">Login</div>
            </div>
        </div>

        <div class="about-section">
            <h1 class="about-title">Contact Us</h1>
            <p class="about-description">
                We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us using the form below.
            </p>
        </div>

        <div class="contact-form">
            <form id="contact-form" action="https://formspree.io/f/mjkbknaw" method="POST" target="hidden-iframe">
                <input type="text" name="name" placeholder="Your Name" required>
                <input type="email" name="email" placeholder="Your Email" required>
                <input type="text" name="subject" placeholder="Subject" required>
                <textarea name="message" placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
            
            <iframe name="hidden-iframe" style="display:none;"></iframe>
            
            
        </div>
    </div>


    <div class="footer">
        <div class="footerDesc">
            <div class="footerTitle">DORO</div>
            <div class="footerContacts">
                <div class="footerButton">Contact</div>
                <div class="footerButton">Support</div>
                <div class="footerButton">Privacy Policy</div>
            </div>
        </div>
        <div class="footerCopyright">&copy; DORO. All rights reserved.</div>
    </div>
    

    <script>
        document.getElementById('contact-form').addEventListener('submit', function(event) {
            // Check if the form is submitted
            setTimeout(function() {
                window.location.href = 'contactpage.html';
            }, 1000); // Redirect after 1 second (adjust as needed)
        });
    </script>

    
    
</body>
</html>