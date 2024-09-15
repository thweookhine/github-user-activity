// Fetch Activites By Username
const getActivites =async (username) => {
    const response = await fetch(`https://api.github.com/users/${username}/events`);

    if(!response.ok) {
        if(response.status === 404) {
            console.error('User Not Found')
            process.exit(1)
        }else {
            console.error('Error Fetching data.')
            process.exit(1)
        }
    }
    const data = await response.json();
    return data;
}

// Check Event Type and Display in Console
const checkEventAndDisplay = (username,activity) => {
    let action = ''
    let repoName = activity.repo.name;
    switch(activity.type){
        case "WatchEvent" :
            action = `watched (${repoName}) Repository`;
            break;
        case "PushEvent" :
            action = `pushed ${activity.payload.size} commits to ${repoName}` 
            break;
        case "CreateEvent":
            action = `created ${activity.payload.ref_type} in ${repoName} Repository`
            break;
        case "CommitCommentEvent":
            action =  `${activity.payload.action} commit comment "${activity.payload.comment}" in ${repoName} Repository`
            break;
        case "DeleteEvent":
            action = `deleted ${activity.payload.ref_type} in ${repoName} Repository`
            break;
        case "ForkEvent":
            action = `forked ${repoName}`
            break;
        case "IssueCommentEvent":
            action =   `${activity.payload.action} issue comment "${activity.payload.comment.body}" in ${repoName} Repository`
            break;
        case "IssuesEvent":
            action = `${activity.payload.action} an issue in ${repoName} Repository`
            break;
        case "MemberEvent":
            action = `${activity.payload.action} member ${activity.payload.member.login} in ${repoName} Repository`
            break;
        case "PublicEvent":
            action = `changed from private to public ${repoName} Repository`
            break;
        case "PullRequestEvent":
            action = `${activity.payload.action} pull request to ${repoName} Repository`
            break;
        case "ReleaseEvent":
            action = `${action.payload.action} ${repoName} Repository`
            break;
        default:
            action = `${activity.type.replace("Event", "")} in ${repoName}`;
            break;
    }        
    console.info(`${username} ${action}`)
}

const doTask = async(username) => {
    let activities;

    activities = await getActivites(username)
    activities.map(activity => {
        checkEventAndDisplay(username,activity);
    })
}

const showUsage = () => {
    console.info('USAGE: ')
    console.info('node index.js username')
}
 
// Checkk args length
if (process.argv.length != 3 ) {
    console.error('Expected only three argument!');
    showUsage()
    process.exit(1);
}else {
   if(process.argv[2] == '-h' || process.argv[2] == 'help' || process.argv[2] == '--help'){
        showUsage()
   }else{
        doTask( process.argv[2])
   }
}

