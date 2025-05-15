import {prisma} from "../prisma/index.js";
import {deleteOldAvatar, saveNewAvatar} from "./supabaseController.js";



/**
 * 1. What does this function do, where is it called?
 * (→ Describe the function’s purpose and trigger point in the app.)
 * e.g., “This function fetches all posts for a specific user. It is triggered when the client navigates to the user's profile page.”
 *
 * 2. What data and method does it expect, and what does it return?
 * (→ Summarize the key input(s) from the frontend or route params and what data is sent back.)
 * e.g., “It expects a userId in the request parameters. It returns an array of posts with related user and comment data.”
 *
 * 3. List the success and error responses. Example:
 *  * 201: User was successfully banned.
 *  * 400: An error occurred (e.g., invalid user ID or database issue).
 * @returns {Promise<void>}
 */


/**
 *
 * 1. This function is used for setting the latest group message in the GroupConversationCard.jsx component
 *
 * 2. It expects the ID from the latest group message which is sent from the Supabase client
 *
 * 3. 200: Successful, sends formated message
 *    500: Server error, log it
 *
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */


export const fetchNewGroupMessage = async (req, res) => {

    try {
        const message_id = parseInt(req.params.message_id); // ID of the message

        // Find the latest message from the groupMessage table
        const latestMessage = await prisma.groupMessages.findFirst({
            where: {
                id: message_id,
            },
            include: {
                sender: true,
                group: true,
                attachments: true
            },
            orderBy: {
                created_at: 'desc',
            },
        });


        latestMessage.hasAttachments = latestMessage.attachments.length > 0; // If it has attachments, set true else false

        // Format message
        const formattedGroupMessage = {
            latestMessage: latestMessage,
            group: latestMessage.group,
        }


        res.status(201).json(formattedGroupMessage); // Successful, send formatted message to front-end

    } catch (err) {
        console.log(err) // Error, log it
        res.status(500).json(`Error fetching latest message`);
    }
}


/**
 * 1. This function is called in the groupRoute once the admin of the group
 *    triggers it in the GroupProfile.jsx components once they update the group description
 *
 * 2. It expects the ID of the group from the parameters and
 *    also the description through the req.body
 *
 *
 * 3. 500: Server error
 *
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */



export const updateGroupDescription = async(req,res, next) => {
    try {

        // If there is no new description, skip this
        if (req.body.description) {
            await prisma.groupChats.update({
                where: {
                    id: parseInt(req.params.groupId),
                },
                data: {
                    description: req.body.description,
                }
            })
        }

        // Go to next middleware
        next();

    } catch (err) {
        console.log(err)
        res.status(500).json(`Error updating group description`);
    }
}




/**
 * 1. This functions is used to leave group chats that the user has been invited to. Which is triggered
 *   in the GroupMemberPopUp.jsx once the user click 'Leave group chat'
 *
 * 2. It expects the ID of the user leaving and the ID of the group they are leaving, which is
 *    sent through the request parameters in the 'DELETE' call
 *
 * 3. 200: Successfully left the group chat
 *    500: Server error
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const leaveGroupChat = async(req,res) => {

    try {
        // Delete group member record
        await prisma.groupMembers.delete({
            where: {
                member_id_group_id: {
                    group_id: parseInt(req.params.groupId), // Where group ID
                    member_id: parseInt(req.params.groupMemberId) // Where user ID
                }
            }
        })
        res.status(200).json(`User left the group chat`);
    } catch (err) {
        res.status(500).json(`Error leaving the group chat`);
    }
}


/**
 * 1. This functions is used to delete group chats, which is triggered by the group admin
 *    in the GroupMemberPopUp.jsx component once they click 'Delete group chat'
 *
 * 2. It only expects the ID of the groupChat to be deleted, which is sent
 *    in the request parameters with the 'DELETE' call
 *
 * 3. 201: Group delete successfully
 *    500: Server error
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const deleteGroupChat = async(req,res) => {

    try {
        await prisma.groupChats.delete({
            where: {
                id: parseInt(req.params.groupId),
            }
        })
        res.status(201).json('Group deleted successfully');
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error deleteing group chat`);
    }
}





/**
 * 1. This functions is used for adding users to an already created group. Which is
 *    triggered in the GroupMemberPopUp.jsx component once a group member adds a new user
 *
 * 2. It expects the ID of the added user and the ID of the group they are added to. Which is sent through
 *    the request parameters in the POST call. The functions send back an updated list of the group users
 *
 * 3. 200: List of updated user
 *    500: Server error
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */




export const addUserToGroup = async(req,res) => {

    try {

        //  Check if they are already in the group
        const alreadyInGroup = await prisma.groupMembers.findFirst({
            where: {
                group_id: parseInt(req.params.groupId),
                member_id: parseInt(req.params.newUserId)
            }
        })

        // If not
        if (!alreadyInGroup) {

            // Add them to the group
            await prisma.groupMembers.create({
                data: {
                    group_id: parseInt(req.params.groupId),
                    member_id: parseInt(req.params.newUserId)
                }
            })

            // Return the updated list of group member
            const updatedUsers = await prisma.groupChats.findUnique({
                where: {
                    id: parseInt(req.params.groupId),
                },
                include: {
                    GroupMembers: {
                        include: {
                            Member: true
                        }
                    }
                }
            })
            res.status(200).json(updatedUsers);
        }

    } catch (err) {
        console.log(err)
        res.status(500).json(`Error adding user to group chat`);
    }

}


/**
 * 1. This function is used to remove users from a group chat, which is triggered by the group admin
 *    in the GroupMemberPopUp.jsx components
 *
 *
 * 2. It expects the ID of the removed user and ID of the group they are removed from, which is sent
 *    through the request parameters in the 'DELETE' call. It then returns the updatede list of the group members
 *
 *
 * 3. 200: List of updated group members
 *    500: Server error
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const removeUserFromGroup = async(req,res) => {
    try {

        // Delete the record
        await prisma.groupMembers.delete({
            where: {
                member_id_group_id: {
                    group_id: parseInt(req.params.groupId), // Group ID
                    member_id: parseInt(req.params.groupMemberId) // User ID
                }
            }
        })

        // List of remaining user
        const remainingUsers = await prisma.groupChats.findUnique({
            where: {
                id: parseInt(req.params.groupId),
            },
            include: {
                GroupMembers: {
                    include: {
                        Member: true
                    }
                }
            }
        })

        // Success, list of remaining user
        res.status(200).json(remainingUsers);
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error removing user from group chat`);
    }
}


/**
 * 1. This functions is used for updating the name of a group chat, which is triggered once the
 *     group admin submits the changes in the GroupProfile.jsx component
 *
 *
 * 2. It expects the ID of the group chat and the updated name sent through the request parameters and body
 *
 *
 * 3. 500: Server error
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */



export const updateGroupName = async(req,res, next) => {
    try {

        // If the there is no group name
        if (req.body.groupName) {

            const groupName = req.body.groupName; // Parse the name

            await prisma.groupChats.update({
                where: {
                    id: parseInt(req.params.groupId), // Update group with ID
                },
                data: {
                    name: groupName,
                }
            })
        }

        // Go to the next middleware
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error updating group name`);
    }
}


/**
 * 1. This functions is used for updating the avatar of a group chat, which is triggered once the
 *     group admin submits the changes in the GroupProfile.jsx component
 *
 *
 * 2. It expects the ID of the group chat and the updated avatar sent through the request parameters and body
 *    in a POST request
 *
 *
 * 3. 200: Group updated successfully
 *    500: Server error
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */




export const updateGroupAvatar = async (req,res, next) => {
    try {

        // If there is no file, continue
        if (req.file) {

            const groupID = parseInt(req.params.groupId);

            const oldAvatar = await prisma.groupChats.findUnique({
                where: {
                    id: groupID
                }
            })

            await deleteOldAvatar(req, res, oldAvatar.avatar);

            const uniqueFileName = await saveNewAvatar(req, res); // Else save the avatar to Supabase (call to supabaseController.js)

            await prisma.groupChats.update({
                data: {
                    avatar: uniqueFileName,
                },
                where: {
                    id: groupID,
                }
            })
            res.status(200).json({message: "Group updated successfully"});
        }

        // Go to next middleware
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json(`Error updating group avatar`);
    }
}