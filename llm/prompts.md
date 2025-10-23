# BF6 Mod SDK Useful Prompts

## Setup

### Initial Documentation Generation

***This is for when the SDK changes so we can redo our documentation and other dev guidelines and skeleton files. You shouldn't have to run this unless your template repository is out of date compared to BF6 Mod SDK***

Develop a dev guidelines file with best practicer guidelines and other tips for llms to follow based on official mod code for battlefield 6 found in Vertigo.ts BombSquad.ts AcePursuit.ts and Exfil.ts. SDK documentation can be found in index.ts and index.d.ts. Generate a human readable documentation markdown file based on index and index.d in DOCS/BF6_SDK.md. Create a skeleton typescript file with a basic code layout and include essential functions and events that are generic and would be common to all game modes that are found inside the official mods in the context. Generate a high level checklist for mod development and include it in DOCS/common_checklist.md. Create a skeleton brief.md file with sections to describe a game like description and rules and number of players and win conditions and ui elements and player variables and teams etc

### TODO Generation
***This prompt will generate a granular todo list for your llm to keep track of progress with throughout development that is based on the information in your brief.md so fill that out first then run this prompt***
Using the guidelines in .llm/dev_guidelines.md and the documentation provided in the index.ts and index.d.ts files inside that directory, generate a granular todo list for developing our game mod for battlefield 6 using the SDK in typescript. Add to the dev guidelines that we will be developing alongside that todo list and make sure to organize it in clear phases with small, concise subtasks and take into account the common_checklist.md we created based on the other sdk first party portal gamemodes. Add to the dev guidelines that we will be keeping track of project progress in .llm/memory.md as well as the changelog.md. Create a readme based on the information in the project brief to give the repository a landing spot. Create any useful helper functions that may be used in other game modes, other projects, or more than once in this project in src/helpers.ts. Organize the code based on the dev guidelines and the build_system.md file found in the DOCS folder.

### Basic Development
***This is a generic development prompt essentially bootstrapping each separate task. Cater this to your liking per task.***

Continue development on our project using the guidelines in llm/dev_guidelines.md. Refer to the todo.md file in the llm folder to direct you on the next task and consult the memory file for history on what has been accomplished. Refer to the docs in the DOCS folder and also in the llm folder for any references you may need. After finishing a sub task, bump the version of the project, update the todo and the memory for the next task and create a proper commit msg detailing changes. Add new stuff to the changelog and address any changes that may need to be documented in the project readme.


### Cleanup Documentation
***Run this prompt when your todo and memory documentation for your LLM are getting long and taking up a lot of context. I typically try to keep my todo and memory files under 5-600 lines.

## Prompts I had to make along the way:
v 0.0.3

make a note in the dev guidelines that the root of the project's git repository is the specific mod folder so that when you run git commands it should be in the MortarGolf directory. Also create a python script that runs using the SDK's bundled version of python to do the version bump for us and make a note in the dev guidelines that version bumping will use that script. write a proper commit msg, update the todo and the memory, and i'll commit and move to the next item on the todo list in the next chat


--
Remember to make any strings that show up in the game contained in a file called MortarGolf.strings.json. you can refer to the format in the other 1st party mods. Please make a note of this in the dev guidelines and the memory