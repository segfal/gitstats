import React from 'react'

const GeneralInfo = ({ghUrl}) => {
    /*
    Do an axios call on ghUrl to retrieve data like repo_name, description, created at, updated at 

    Contributors: ghUrl/contributors 
    Total contributions: Go through each object that contains a contributor, go to 'contributions' and add them up.

    Individual Contributors: In each object get, "login", "avatar_url", "html_url", and "contributions"


    ghUrl: https://api.github.com/repos/{username}/{repo_name}
    https://api.github.com/repos/segfal/KaraokeApp
    
    
    */
  return (
    <div>
         <h1>GeneralInfo</h1>
         <h1>{ghUrl}</h1>
    </div>
   
  )
}

export default GeneralInfo