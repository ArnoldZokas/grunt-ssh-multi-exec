#!/bin/sh
apt-get update -y -q

useradd test --create-home -s /bin/bash
echo "test:test"|chpasswd