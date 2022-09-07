export const New ={
    name : "New",
    label : "New",
    countLabel : "newCount",
    value : "2",
    AllowedActions : ["UpforArchival","InActive"],
    DataGridFields : [{Header: "Document Name", value : "title" }, 
                      {Header : "Previous Status", value : "previous_Status"},
                      {Header : "Document Category", value : "document_Category"} ]
}
export const NewSharePoint ={
    name : "SharePoint",
    label : "SharePoint",
    countLabel : "sharePointCount",
    value : "20",
    AllowedActions : ["UpforArchival","InActive"]
}
export const Assigned ={
    name : "Assigned",
    label : "Assigned",
    countLabel : "assignedCount",
    value : "3",
    AllowedActions : ["InProgress"]
}
export const InProgress ={
    name : "InProgress",
    label : "In Progress",
    countLabel : "inProgressCount",
    value : "4",
    AllowedActions : ["Archived","InActive","OnHold","PendingApproval", "Publish" ,"PendingReview", "QA"]
}
export const PendingReview ={
    name : "PendingReview",
    label : "Pending Review",
    countLabel : "pendingReviewCount",
    value : "5",
    AllowedActions : ["InProgress"]
}
export const QA ={
    name : "QA",
    label : "Ready for QA",
    countLabel : "qaCount",
    value : "6",
    AllowedActions : ["Archived","InActive","ReWork","Publish"]
}
export const ReWork ={
    name : "ReWork",
    label : "Rework Required",
    countLabel : "reWorkCount",
    value : "7",
    AllowedActions : ["InActive","PendingApproval","OnHold","QA", "Publish","PendingReview","Archived"]

}
export const ResponseRecieved ={
    name : "ResponseRecieved",
    label : "Response Recieved",
    countLabel : "responseRecievedCount",
    value : "8",
    AllowedActions : ["InActive","OnHold","QA", "Publish","Archived","PendingReview","PendingApproval"]

}
export const ApprovalRecieved ={
    name : "ApprovalRecieved",
    label : "Approval Recieved",
    countLabel : "approvalRecievedCount",
    value : "9",
    AllowedActions : ["Publish","OnHold","InActive","QA","Archived"]
}
export const Published ={
    name : "Publish",
    label : "Publish",
    countLabel : "publishedCount",
    value : "10",
    AllowedActions : ["UnPublished","InActive","Archived"]
}

export const PendingApproval ={
    name : "PendingApproval",
    label : "Pending Approval",
    countLabel : "pendingApprovalCount",
    value : "11",
    AllowedActions : ["InActive","Archived","OnHold"]
}

export const OnHold ={
    name : "OnHold",
    label : "On Hold",
    countLabel : "onHoldCount",
    value : "12",
    AllowedActions : ["InActive","Archived"]
}

export const UnPublished ={
    name : "UnPublished",
    label : "Un Published",
    countLabel : "unPublishedCount",
    value : "13",
    AllowedActions : ["Publish","PendingApproval","OnHold","InActive","Archived"]
}

export const Archived ={
    name : "Archived",
    label : "Archived",
    countLabel : "archivedCount",
    value : "14",
    AllowedActions : ["InActive","InProgress"]
}

export const InActive ={
    name : "InActive",
    label : "InActive",
    countLabel : "inActiveCount",
    value : "15",
    AllowedActions : ["InProgress","Archived"]
}

export const upforArchival ={
    name : "UpforArchival",
    label : "Up for Archival",
    countLabel : "upforArchivalCount",
    value : "16",
    AllowedActions : ["InActive","Archived"]
}


export const MyWorkSpace_ByStatus = [
    Assigned,
    InProgress,
    PendingReview,
    QA,
    ReWork,
    ResponseRecieved,
    ApprovalRecieved,
    Published,
    PendingApproval,
    OnHold,
    UnPublished,
    upforArchival,
    Archived,
    InActive,
    
]
export const Queue_ByStatus = [
    //NewSharePoint,
    New,
    Assigned,
    InProgress,
    PendingReview,
    QA,
    ReWork,
    ResponseRecieved,
    ApprovalRecieved,
    Published,
    PendingApproval,
    OnHold,
    UnPublished,
    upforArchival,
    Archived,
    InActive,
    
]
