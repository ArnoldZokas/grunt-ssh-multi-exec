#!/bin/sh
apt-get update -y -q

useradd test --create-home -s /bin/bash
echo "test:test"|chpasswd

mkdir /home/test/.ssh
cat /vagrant/test/test.pub >> /home/test/.ssh/authorized_keys
reload ssh