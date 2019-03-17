---
id: using-zfs-snapshots-clones
summary: Learn how to use snapshots and cloning in ZFS.
categories: server
tags: guide, zfs, server
difficulty: 2
status: published
feedback_url: https://github.com/canonical-websites/tutorials.ubuntu.com/issues
author: Ivan Fonseca <ivanfon@riseup.net>
published: 2017-12-09
---

# Using ZFS Snapshots and Clones

## Overview
Duration: 2:00

### What we'll learn

In this tutorial we will learn about ZFS snapshots and ZFS clones, what they are and how to use them.

### Snapshots

A snapshot is a read-only copy of a filesystem taken at a moment in time. Snapshots only record differences between the snapshot and the current filesystem. This means that, until you start making changes to the active filesystem, snapshots won’t take up any additional storage.

A snapshot can’t be directly accessed; they are cloned, backed up and rolled back to. They are persistent and consume disk space from the same storage pool in which they were created.

### Clones

A clone is similar to a snapshot, although it can be written to. Much like snapshots, they only start taking up space once changes are made.

Clones can only be created from snapshots.

We will go over both clones and snapshots in more detail in the next sections.

### What you'll need

- A system running ZFS
- Basic ZFS knowledge
- Basic command-line knowledge

Survey
: How will you use this tutorial?
 - Only read through it
 - Read it and complete the exercises
: What is your current level of experience with ZFS?
 - Novice
 - Intermediate
 - Proficient

## Using snapshots
Duration: 5:00

### Snapshot naming

Snapshot names consist of the name of the filesystem, followed by an `@` and the name of the snapshot. For example, the snapshot `snapname` of the filesystem `filesystem` would be `filesystem@snapname`.

### Listing snapshots

We can list snapshots using the `zfs list` command and specifying the type as snapshot:

`zfs list -t snapshot`

### Creating snapshots

Snapshots are created using the `zfs snapshot` command, or `zfs snap` for short. We pass it the name of the snapshot we want to create.

For example, if we wanted to create a snapshot of `rpool/example` called `snap1`, we run:

`snapshot create rpool/example@snap1`

Now, if we list all our snapshots, we should see our newly created snapshot in the list:

```
$ zfs list -t snapshot
NAME                   USED  AVAIL  REFER  MOUNTPOINT
...
rpool/example@snap1       -      -      -  -
...
```

### Deleting snapshots

Snapshots are deleted using the `zfs destroy` command.

positive
: **You may not delete a snapshot that has been cloned.**
You must delete all clones of a snapshot before deleting it. We’ll go over cloning in the next sections.

positive
: **You may not delete a dataset that has had snapshots made from it.**
You must delete all snapshots originating from a dataset before deleting it.

For example, to delete our `rpool/example@snap1` snapshot from earlier, we specify it’s name in the `zfs destroy` command:

`zfs destroy rpool/example@snap1`

If we list our snapshots again (`zfs list -t snapshot`), the deleted one will no longer appear.

### Renaming snapshots

Snapshots can be renamed using the `zfs rename` command. We pass in the current name, along with the new name.

For example, to rename our snapshot from earlier from `snap1` to `snap2`, we run `zfs rename rpool/example@snap1 rpool/example@snap2`. Note that the filesystem must be the same. This means that we couldn't run `zfs rename rpool/example@snap1 rpool/something@snap2`.

Since the filesystem must remain the same, for the example above, we could simply run `zfs rename rpool/example@snap1 snap2` to rename the pool to `snap2`.

### Rolling back a snapshot

Using the `zfs rollback` command, we can rollback the active filesystem to a snapshot. This will delete all changes made since the snapshot was created, reverting the active filesystem to that point in time.

If we wanted to rollback to our snapshot `rpool/example@snap1` from the examples above, we run `zfs rollback rpool/example@snap1`.

positive
: **Any snapshots made after the snapshot that you want to roll back to must be deleted.**
You can do this automatically by adding the `-r` flag to the `zfs rollback` command.

## Using clones
Duration: 5:00

positive
: **This section will use the snapshot made in the last section.**
We will use `rpool/example@snap1` like in the last section. You may use your own snapshot if it is named differently.

### Creating a clone

A clone must be created from a snapshot using the `zfs clone` command. We first pass in the snapshot name, followed by the clone name. For example, to create a clone called `rpool/clone` based on the `rpool/example@snap1` snapshot, we run `zfs clone rpool/example@snap1 rpool/clone`.

### Deleting clones

Clones may be deleted using the `zfs destroy` command, just like snapshots. We pass the clone name: `zfs destroy rpool/clone`.

positive
: **All clones of a snapshot must be deleted before the snapshot can be deleted.**
We wouldn't be able to delete the `rpool/example@snap1` snapshot before we deleted the `rpool/clone` clone.

### Replacing a filesystem with a clone

We can use the `zfs promote` command to replace an active filesystem with a clone of the same filesystem. This will cause the original filesystem to become the clone of the filesystem. This also allows you to delete the filesystem from which a clone was created.

For example, say we created a snapshot of `rpool/example` called `rpool/example@snap1`, then we created a clone from that snapshot called `rpool/clone`. Running `zfs promote rpool/clone` would swap `rpool/example` (the original filesystem) with `rpool/clone` (the clone of the filesystem). This swaps the two, causing `rpool/example` to become a clone of `rpool/clone`.

At this point you could rename the new filesystem and/or delete the old one to completely replace the original with the clone.

## Conclusion
Duration: 1:00

Congratulations, you should now know the basics of ZFS snapshots and clones!'

### Further reading

This was a brief overview. The fantastic ZFS documentation has much more information of snapshots and clones, available [here](https://docs.oracle.com/cd/E23824_01/html/821-1448/gavvx.html).

