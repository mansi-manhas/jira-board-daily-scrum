# [ WIP (Work In Progress) ] Agile Central Dashboard & Automating Sub Task Creation
A central board to integrate all relevant bugs / tickets / stories from Jira at one place.

# Problem Statement
Jira allows different organizations to create jira projects at organizational level. Jira gives a descriptive and a birds eye view for all the backlogs of a project, its respective bugs and offers a lot of advantages using their features like managing scrum boards and creating dashboards using third party gadgets.

Problems Analyzed -
- Dashboards can currently only display 2-dimensional data. Example - progress of each story, but not its status in the same view.
- Aggregations like SUM can only be applied on one field, and not multiple.
- Filtering is not easy and takes time
- We cannot see user progress for every sprint unless boards are saved in a particular format. One single view which gives the idea of number of user stories, subtasks and bugs each user of a scrum team is working on is also not visible.
- Multiple users have to create similar subtasks repeatedly. There is no feature for user to save a subtask template for its repetitive use.

# Existing Solutions

- Multi-dimensional Jira gadgets
- Jira Automation - No code tool

# Implementation

- Creating a central dashboard that offers a unique way to look at all the Jira related items
- Currently in Jira, I can only see tasks for one team. However, as a Manager, If I am managing more than 5 - 6 teams, I need easy access, easy view to all the Jira relevant tasks
- This central dashboard will act as a single source of thruth for all AGILE task starting from GROOMING, PLANNING, SPRINT HEALTH, DAILY SCRUM VIEW, and SPRINT RELEASE.





