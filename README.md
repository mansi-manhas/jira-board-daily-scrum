# Agile Central Dashboard & Automating Sub Task Creation 
# [ WIP (Work In Progress) ] 
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

# Wireframes

![image](https://user-images.githubusercontent.com/18692751/135309727-ef5b9191-234b-4ee6-a221-01b3e4060886.png)

![image](https://user-images.githubusercontent.com/18692751/135309782-7eb27fcf-8fcc-4c9a-8c32-7bbcb73a8ecd.png)

![image](https://user-images.githubusercontent.com/18692751/135309862-0e60c005-bb69-412f-8db6-59edc9a9a51f.png)

![image](https://user-images.githubusercontent.com/18692751/135309923-f8e296d8-4d00-4d04-b334-81f07f998305.png)


# High - Level Architecture

![image](https://user-images.githubusercontent.com/18692751/135310055-574cf586-7813-4920-9d74-47ef9caadf00.png)

# Sample - Screenshots

![image](https://user-images.githubusercontent.com/18692751/135310180-dada40b1-e9a3-4dc7-b645-a8186930b2a8.png)

![image](https://user-images.githubusercontent.com/18692751/135310225-18d533bf-df0c-4b8b-807a-523733648761.png)

![image](https://user-images.githubusercontent.com/18692751/135310295-3a962833-98ae-4359-8fa5-ed066c3308b5.png)

![image](https://user-images.githubusercontent.com/18692751/135310336-7a16ddca-1ede-46f7-bf04-8c172414c960.png)

![image](https://user-images.githubusercontent.com/18692751/135310381-311cb2c2-46e8-41a3-a550-ed8b767f8a32.png)

# Potential Risks

- Productivity benefits yet to be measured
- Authorization issues, and other technical issues like paging not implemented 
- Jira API Reference does not have enough samples, have to rely on community




