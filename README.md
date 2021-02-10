# install-private-pod
A Github Action that enables you to install a private Cocoapod hosted in a git repo

## Inputs

### `NAME`

Name of the key to be used to save the private SSH Key.

**Required**

### `SSH_KEY`

SSH_KEY is the private SSH key to be used to install the pod.

**Required**

### `REPO`

SSH URL of the private pod repository.

**Required**

### `PODFILE`

Podfile path where the SSH URL of the private pod repository is used to install the pod.

**Required**

**Default Value** 

If unspecified, assumed to be `./podfile`.


## Example Usage

```yml
- name: Setup REPO_ONE_DEPLOY_KEY_PRIVATE
  uses: gps/install-private-pod@master
  with:
    NAME: "REPO_ONE_SSH_KEY"
    SSH_KEY: ${{ secrets.REPO_ONE_DEPLOY_KEY_PRIVATE }}
    REPO: "git@github.com:surya-soft/repo-one.git"
    PODFILE: "./app/podfile"
- name: Setup REPO_TWO_DEPLOY_KEY_PRIVATE
  uses: gps/install-private-pod@master
  with:
    NAME: "REPO_TWO_SSH_KEY"
    SSH_KEY: ${{ secrets.REPO_TWO_DEPLOY_KEY_PRIVATE }}
    REPO: "git@github.com:surya-soft/repo-two.git"
    PODFILE: "./app/podfile"
```

## Problem it solves

When there are multiple private pods to be installed which has different deploy keys, it is not possible to use different keys for each pod since the ssh-agent matches these SSH keys with the `github.com` host and it uses the latest key that was added. In which case the others private pods cannot be installed and access will be denied. One way to get around with this is to use same deploy key in all the private pods and use it to install the private pods. But if the choice is to use different deploy keys for each pod ,`gps/install-private-pod` github action can be used.

## What it does?

Creates a SSH file in ./ssh folder in the home directory with the `NAME` provided and writes the `SSH_KEY` to the newly created file. Adds the SSH config for the given SSH key to use this particular key for the host `github-{{NAME}}`. Where `NAME` is the input provided to name the key. Modifies podfile  by replacing `github.com` with `github-{{NAME}}` in the `REPO` SSH URL.

For example:

```yml
- name: Setup REPO_DEPLOY_KEY_PRIVATE
  uses: gps/install-private-pod@master
  with:
    NAME: "REPO_SSH_KEY"
    SSH_KEY: ${{ secrets.REPO_DEPLOY_KEY_PRIVATE }}
    REPO: "git@github.com:surya-soft/repo.git"
    PODFILE: "./app/podfile"
```

For the above job:
* file `REPO_SSH_KEY` will be created in ./ssh folder in home directory
* SSH config will be added to use `REPO_SSH_KEY` key for host `github-REPO_SSH_KEY`
* Replace `git@github.com:surya-soft/repo.git` with `git@github-REPO_SSH_KEY:surya-soft/repo.git` in the `./app/podfile` file.
