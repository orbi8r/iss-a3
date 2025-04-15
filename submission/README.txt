I have used GODOT web export for the Main project build in GDScript+HTML, but due to high file size (even after webasm convertion) I had to use a different method, Taking a Video and using HTML, CSS, JS on that.
LLM used -> Claude 3.7 Sonnet, GPT 4.1 for CSS/JS.
Python and GDScript being used in this project didnt require LLM help.

There is a long loading time due to downloading of the assets, I didnt have enough time to try parallel processing and the project didnt look good with memory adaptation and management.
But the Wait might be worth it, put a lot of effort into it.